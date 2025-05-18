import { isTokenExpired, refreshAccessToken } from './auth_utils.js';


const PUBLIC_URLS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/check-email',
  '/api/v1/auth/check-username',
  '/api/v1/auth/request-reset',
  '/api/v1/auth/reset-password',
  '/api/v1/auth/refresh-token',
  '/pets/available',
  '/api/v1/events'
];

function isPublicUrl(url) {
  return PUBLIC_URLS.some(publicUrl => url.includes(publicUrl));
}

function startTokenExpirationChecker() {
    const interval = setInterval(async () => {
        if (!localStorage.getItem('token')) {
            return;
        }
        
        if (isTokenExpired()) {
            console.log('Token is about to expire, refreshing...');
            try {
                await refreshAccessToken();
                console.log('Token refreshed proactively');
            } catch (error) {
                console.error('Proactive token refresh failed:', error);
            }
        }
    }, 30000); // 30 sec
    
    window.addEventListener('beforeunload', () => {
        clearInterval(interval);
    });
}


export function setupAuthInterceptor() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(url, options = {}) {
        if (isPublicUrl(url)) {
            return originalFetch(url, options);
        }
        
        let token = localStorage.getItem('token');
        
        if (!token || isTokenExpired()) {
                token = await refreshAccessToken();
        }
        
        const updatedOptions = {
            ...options,
            credentials: 'include' // cookies
        };
        
        // authorization header
        if (token) {
            updatedOptions.headers = {
                ...updatedOptions.headers,
                'Authorization': `Bearer ${token}`
            };
        }
        
        try {
            const response = await originalFetch(url, updatedOptions);
            
            if (response.status === 401) {
                try {
                    token = await refreshAccessToken();
                    
                    const retryOptions = {
                        ...updatedOptions,
                        headers: {
                            ...updatedOptions.headers,
                            'Authorization': `Bearer ${token}`
                        }
                    };
                    
                    return originalFetch(url, retryOptions);
                } catch (error) {
                    return response; 
                }
            }
            
            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };
    
    startTokenExpirationChecker();
    
    console.log('Auth interceptor setup complete with proactive token refresh');
}