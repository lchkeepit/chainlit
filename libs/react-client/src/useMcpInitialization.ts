import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { mcpState } from './state';
import { IMcp } from './types';
import { useConfig } from './useConfig';
import { useChatSession } from './useChatSession';

export const useMcpInitialization = () => {
  const { config } = useConfig();
  const [mcpConnections, setMcpConnections] = useRecoilState(mcpState);

  // This effect sets up MCP connections from the backend config when it's available
  useEffect(() => {
    // Only process when we have config data from the backend
    if (config?.features?.mcp?.initial_connections) {
      const initialConnections = config.features.mcp.initial_connections;
      
      if (initialConnections.length > 0) {
        console.log('Backend MCP config received:', initialConnections);
        
        // Map backend connections to the client format
        const mappedConnections: IMcp[] = initialConnections.map((conn) => {
          // Get any existing connection with the same name to preserve dynamic state
          const existingConn = mcpConnections.find(c => c.name === conn.name);
          
          // Create a connection object with backend data
          const newConn: IMcp = {
            name: conn.name || '',
            clientType: conn.clientType || 'stdio',
            command: conn.fullCommand || '',
            url: conn.url || '',
            env: conn.env || {},
            // For existing connections, preserve their tools and status
            tools: existingConn?.tools || [],
            status: existingConn?.status || 'connecting'
          };
          
          return newConn;
        });
        
        // Only update if the connections have actually changed
        const currentNames = new Set(mcpConnections.map(c => c.name));
        const newNames = new Set(mappedConnections.map(c => c.name));
        
        // If there's any difference in names or count, update the state
        if (currentNames.size !== newNames.size || 
            ![...currentNames].every(name => newNames.has(name))) {
          console.log('Updating MCP connections from backend config:', mappedConnections);
          setMcpConnections(mappedConnections);
        }
      } else if (mcpConnections.length > 0) {
        // If backend has no connections but we have some locally, clear them
        console.log('Clearing MCP connections as backend has none');
        setMcpConnections([]);
      }
    }
  }, [config, mcpConnections, setMcpConnections]);

  return { mcpConnections };
};
