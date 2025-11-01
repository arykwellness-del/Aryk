import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, loading } = useAuth();
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    // Check localStorage for user data as fallback
    const savedUser = localStorage.getItem('aryk_user');
    if (savedUser) {
      setLocalUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // If not loading and no auth user, check local user
    if (!loading && !authUser) {
      if (localUser) {
        // User exists in localStorage, redirect to Shopify shop
        navigate('/shopify-shop');
      } else {
        // No user found, redirect to home
        navigate('/');
      }
      return;
    }
    
    // If user is logged in via AuthContext, redirect to Shopify shop page
    if (authUser) {
      navigate('/shopify-shop');
    }
  }, [authUser, loading, localUser, navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          {loading ? 'Checking authentication...' : 'Redirecting to Shopify Profile...'}
        </h2>
        <p className="text-gray-600 mb-4">
          {loading 
            ? 'Please wait while we verify your login status.' 
            : 'Please wait while we take you to your Shopify account.'
          }
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
