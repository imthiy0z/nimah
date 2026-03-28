import React, { useMemo, useState } from 'react';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import StoreDetailScreen from './screens/StoreDetailScreen';
import ReportsScreen from './screens/ReportsScreen';
import OrdersScreen from './screens/OrdersScreen';
import RewardsScreen from './screens/RewardsScreen';
import CartScreen, { type CartLine } from './screens/CartScreen';
import StoreOwnerDashboardScreen from './screens/storeOwner/StoreOwnerDashboardScreen';
import StoreOwnerOrdersScreen from './screens/storeOwner/StoreOwnerOrdersScreen';
import StoreOwnerListingsScreen from './screens/storeOwner/StoreOwnerListingsScreen';
import StoreOwnerMessagesScreen from './screens/storeOwner/StoreOwnerMessagesScreen';
import StoreOwnerProfileScreen from './screens/storeOwner/StoreOwnerProfileScreen';
import {
  getStoreOwnerMessageThreads,
  resolveOwnerStoreIdFromHint,
  type PartnerStore,
  type RescueBag,
} from './constants/mockData';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [showStoreDetail, setShowStoreDetail] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [storeDetailSource, setStoreDetailSource] = useState<'discover' | 'home'>(
    'discover'
  );
  const [showReports, setShowReports] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const cartCount = cartLines.reduce((sum, l) => sum + l.qty, 0);
  const [activeTab, setActiveTab] = useState('home');
  /** Where to return when closing chat / notifications / profile opened from a main tab */
  const [restoreAfterOverlay, setRestoreAfterOverlay] = useState<
    'home' | 'discover' | 'cart' | 'orders' | 'rewards'
  >('home');

  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [ownerStoreId, setOwnerStoreId] = useState<string>('neeb');
  const [storeOwnerTab, setStoreOwnerTab] = useState<string>('owner-dashboard');

  const ownerMessageUnreadCount = useMemo(
    () => getStoreOwnerMessageThreads(ownerStoreId).filter((x) => x.unread).length,
    [ownerStoreId]
  );

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    setShowStoreDetail(false);
    if (tabId === 'chat') {
      if (showDiscover) {
        setRestoreAfterOverlay('discover');
      } else if (showCart) {
        setRestoreAfterOverlay('cart');
      } else if (showOrders) {
        setRestoreAfterOverlay('orders');
      } else if (showRewards) {
        setRestoreAfterOverlay('rewards');
      } else {
        setRestoreAfterOverlay('home');
      }
      setShowChat(true);
      setShowHome(false);
      setShowProfile(false);
      setShowRewards(false);
      setShowDiscover(false);
      setShowOrders(false);
      setShowCart(false);
    } else if (tabId === 'home') {
      setShowHome(true);
      setShowChat(false);
      setShowProfile(false);
      setShowRewards(false);
      setShowDiscover(false);
      setShowOrders(false);
      setShowCart(false);
    } else if (tabId === 'rewards') {
      setShowRewards(true);
      setShowHome(false);
      setShowChat(false);
      setShowProfile(false);
      setShowDiscover(false);
      setShowOrders(false);
      setShowCart(false);
    } else if (tabId === 'discover') {
      setShowDiscover(true);
      setShowHome(false);
      setShowChat(false);
      setShowProfile(false);
      setShowRewards(false);
      setShowOrders(false);
      setShowCart(false);
    } else if (tabId === 'orders') {
      setShowOrders(true);
      setShowHome(false);
      setShowChat(false);
      setShowProfile(false);
      setShowRewards(false);
      setShowDiscover(false);
      setShowCart(false);
    } else if (tabId === 'cart') {
      setShowCart(true);
      setShowHome(false);
      setShowChat(false);
      setShowProfile(false);
      setShowRewards(false);
      setShowDiscover(false);
      setShowOrders(false);
    }
  };

  const restoreOverlayScreen = () => {
    if (restoreAfterOverlay === 'discover') {
      setShowDiscover(true);
      setActiveTab('discover');
      return;
    }
    if (restoreAfterOverlay === 'cart') {
      setShowCart(true);
      setActiveTab('cart');
      return;
    }
    if (restoreAfterOverlay === 'orders') {
      setShowOrders(true);
      setActiveTab('orders');
      return;
    }
    if (restoreAfterOverlay === 'rewards') {
      setShowRewards(true);
      setActiveTab('rewards');
      return;
    }
    setShowHome(true);
    setActiveTab('home');
  };

  const addToCart = (store: PartnerStore, bag: RescueBag, qty: number = 1) => {
    setCartLines((prev) => {
      const existingIdx = prev.findIndex((l) => l.storeId === store.id && l.bagId === bag.id);
      const maxQty = bag.left ?? 99;
      const safeQty = Math.max(0, qty);
      if (maxQty <= 0 || safeQty <= 0) return prev;
      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const nextQty = Math.min(maxQty, existing.qty + safeQty);
        const next = [...prev];
        next[existingIdx] = { ...existing, qty: nextQty };
        return next;
      }
      const lineQty = Math.min(maxQty, safeQty);
      if (lineQty <= 0) return prev;
      return [
        ...prev,
        {
          storeId: store.id,
          storeName: store.name,
          bagId: bag.id,
          bagTitle: bag.title,
          price: bag.price,
          retailValue: bag.retailValue,
          pickupWindow: bag.pickupWindow,
          left: bag.left,
          image: bag.image,
          qty: lineQty,
        },
      ];
    });
  };

  const placeOrder = () => {
    setCartLines([]);
    setShowCart(false);
    setShowOrders(true);
    setActiveTab('orders');
  };

  const storeOwnerScreenProps = {
    storeId: ownerStoreId,
    activeTab: storeOwnerTab,
    onTabPress: (id: string) => setStoreOwnerTab(id),
    onNotificationsPress: () => setShowNotifications(true),
    messageUnreadCount: ownerMessageUnreadCount,
    onSupportChatPress: () => setShowChat(true),
  };

  const renderStoreOwnerApp = () => {
    switch (storeOwnerTab) {
      case 'owner-orders':
        return <StoreOwnerOrdersScreen {...storeOwnerScreenProps} />;
      case 'owner-listings':
        return <StoreOwnerListingsScreen {...storeOwnerScreenProps} />;
      case 'owner-messages':
        return <StoreOwnerMessagesScreen {...storeOwnerScreenProps} />;
      case 'owner-profile':
        return (
          <StoreOwnerProfileScreen
            {...storeOwnerScreenProps}
            onSignOut={() => {
              setIsStoreOwner(false);
              setOwnerStoreId('neeb');
              setStoreOwnerTab('owner-dashboard');
              setShowLogin(true);
            }}
          />
        );
      case 'owner-dashboard':
      default:
        return <StoreOwnerDashboardScreen {...storeOwnerScreenProps} />;
    }
  };

  if (showNotifications) {
    return (
      <NotificationsScreen
        onBack={() => {
          setShowNotifications(false);
          if (!isStoreOwner) {
            restoreOverlayScreen();
          }
        }}
      />
    );
  }

  if (showChat) {
    return (
      <ChatScreen
        onBack={() => {
          setShowChat(false);
          if (!isStoreOwner) {
            restoreOverlayScreen();
          }
        }}
      />
    );
  }

  if (!isStoreOwner && showOrders) {
    return (
      <OrdersScreen
        activeTab={activeTab}
        onTabPress={handleTabPress}
        cartCount={cartCount}
        onProfilePress={() => {
          setRestoreAfterOverlay('orders');
          setShowProfile(true);
          setShowOrders(false);
          setActiveTab('orders');
        }}
        onNotificationsPress={() => {
          setRestoreAfterOverlay('orders');
          setShowNotifications(true);
          setShowOrders(false);
        }}
      />
    );
  }

  if (!isStoreOwner && showCart) {
    return (
      <CartScreen
        activeTab={activeTab}
        onTabPress={handleTabPress}
        cartCount={cartCount}
        cartLines={cartLines}
        onCartChange={(lines) => setCartLines(lines)}
        onPlaceOrder={placeOrder}
        onProfilePress={() => {
          setRestoreAfterOverlay('cart');
          setShowProfile(true);
          setShowCart(false);
          setActiveTab('cart');
        }}
        onNotificationsPress={() => {
          setRestoreAfterOverlay('cart');
          setShowNotifications(true);
          setShowCart(false);
        }}
      />
    );
  }

  if (!isStoreOwner && showRewards) {
    return (
      <RewardsScreen
        activeTab={activeTab}
        onTabPress={handleTabPress}
        cartCount={cartCount}
        onProfilePress={() => {
          setRestoreAfterOverlay('rewards');
          setShowRewards(false);
          setShowProfile(true);
          setActiveTab('rewards');
        }}
        onNotificationsPress={() => {
          setRestoreAfterOverlay('rewards');
          setShowNotifications(true);
          setShowRewards(false);
        }}
      />
    );
  }

  if (!isStoreOwner && showReports) {
    return (
      <ReportsScreen
        onBack={() => {
          setShowReports(false);
          setShowHome(true);
        }}
      />
    );
  }

  if (!isStoreOwner && showStoreDetail) {
    return (
      <StoreDetailScreen
        storeId={selectedStoreId}
        onAddToCart={addToCart}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        cartCount={cartCount}
        onBack={() => {
          setShowStoreDetail(false);
          if (storeDetailSource === 'home') {
            setShowHome(true);
            setActiveTab('home');
          } else {
            setShowDiscover(true);
          }
        }}
      />
    );
  }

  if (!isStoreOwner && showDiscover) {
    return (
      <DiscoverScreen
        activeTab={activeTab}
        onTabPress={handleTabPress}
        cartCount={cartCount}
        onProfilePress={() => {
          setRestoreAfterOverlay('discover');
          setShowProfile(true);
          setShowDiscover(false);
          setActiveTab('discover');
        }}
        onNotificationsPress={() => {
          setRestoreAfterOverlay('discover');
          setShowNotifications(true);
          setShowDiscover(false);
        }}
        onStorePress={(storeId) => {
          setStoreDetailSource('discover');
          setSelectedStoreId(storeId);
          setShowStoreDetail(true);
          setShowDiscover(false);
        }}
      />
    );
  }

  if (!isStoreOwner && showProfile) {
    return (
      <ProfileScreen
        onBack={() => {
          setShowProfile(false);
          restoreOverlayScreen();
        }}
        onReportsPress={() => {
          setShowReports(true);
          setShowProfile(false);
        }}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        cartCount={cartCount}
      />
    );
  }

  if (!isStoreOwner && showHome) {
    return (
      <HomeScreen
        onProfilePress={() => {
          setRestoreAfterOverlay('home');
          setShowProfile(true);
          setShowHome(false);
          setActiveTab('home');
        }}
        onNotificationsPress={() => {
          setRestoreAfterOverlay('home');
          setShowNotifications(true);
          setShowHome(false);
        }}
        onReportsPress={() => {
          setShowReports(true);
          setShowHome(false);
        }}
        onOrdersPress={() => {
          setShowOrders(true);
          setShowHome(false);
          setActiveTab('orders');
        }}
        onDiscoverPress={() => {
          setShowDiscover(true);
          setShowHome(false);
          setActiveTab('discover');
        }}
        onStoreFromMapPress={(storeId) => {
          setStoreDetailSource('home');
          setSelectedStoreId(storeId);
          setShowStoreDetail(true);
          setShowHome(false);
        }}
        activeTab={activeTab}
        onTabPress={handleTabPress}
        cartCount={cartCount}
        onAddToCart={addToCart}
      />
    );
  }

  if (isStoreOwner) {
    return renderStoreOwnerApp();
  }

  if (showLogin) {
    return (
      <LoginScreen
        onBack={() => setShowLogin(false)}
        onLogin={() => {
          setIsStoreOwner(false);
          setShowLogin(false);
          setShowHome(true);
          setActiveTab('home');
        }}
        onStoreOwnerLogin={(hint) => {
          setIsStoreOwner(true);
          setOwnerStoreId(resolveOwnerStoreIdFromHint(hint));
          setStoreOwnerTab('owner-dashboard');
          setShowLogin(false);
          setShowHome(false);
          setShowProfile(false);
          setShowRewards(false);
          setShowDiscover(false);
          setShowOrders(false);
          setShowCart(false);
          setShowStoreDetail(false);
          setShowReports(false);
          setShowChat(false);
          setShowNotifications(false);
        }}
        onSignUp={() => {
          console.log('Sign up pressed');
        }}
      />
    );
  }

  return <OnboardingScreen onBegin={() => setShowLogin(true)} />;
}
