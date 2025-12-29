import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Flex, Text, Spinner } from "@radix-ui/themes";
import axios from "axios";

export function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleProviderCallback } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      // The query string may contain id_token, access_token, or (usually with Strapi) key/value params 
      // like ?id_token=...&access_token=...&raw[...]=...
      
      // Let's first check what we have in the search params
      const searchParams = new URLSearchParams(location.search);
      const idToken = searchParams.get('id_token');
      const accessToken = searchParams.get('access_token');
      const error = searchParams.get('error');

      if (error) {
        console.error("Auth Error:", error);
        navigate("/login");
        return;
      }

      // If Strapi redirected here directly after Auth0 callback, 
      // we usually need to send the access_token/id_token to Strapi's backend to complete the login
      // effectively exchanging the provider token for a Strapi JWT.
      // Endpoint: /api/auth/{provider}/callback
      
      if (idToken || accessToken) {
        try {
          // Construct the query string exactly as Strapi expects it
          // Strapi usually expects: /api/auth/auth0/callback?access_token=...
          
          const strapiCallbackUrl = `http://localhost:1337/api/auth/auth0/callback${location.search}`;
          
          const response = await axios.get(strapiCallbackUrl);
          
          const { jwt, user } = response.data;
          
          handleProviderCallback(jwt, user);
          navigate("/");
          
        } catch (err) {
          console.error("Failed to exchange token with Strapi:", err);
          navigate("/login");
        }
      } else {
        // Fallback: Sometimes Strapi redirects with JWT directly if configured so
        // Check if `jwt` and `user` are present directly (less common with Auth0 standard flow but possible)
        const jwt = searchParams.get('jwt');
        if (jwt) {
           // This path assumes user info might need to be fetched or is passed as JSON string
           // Simplified for now, assuming standard flow above handles it.
           console.warn("Direct JWT found but not handled yet.");
           navigate("/login");
        } else {
           console.error("No token found in URL");
           navigate("/login");
        }
      }
    };

    processCallback();
  }, [location, navigate, handleProviderCallback]);

  return (
    <Flex align="center" justify="center" style={{ height: "100vh" }}>
      <Flex direction="column" align="center" gap="3">
        <Spinner size="3" />
        <Text>Authenticating...</Text>
      </Flex>
    </Flex>
  );
}
