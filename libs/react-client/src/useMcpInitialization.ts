import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { hasMcpInitializedState, mcpState } from './state';
import { IMcp } from './types';
import { useConfig } from './useConfig';

export const useMcpInitialization = () => {
  const { config } = useConfig();
  const [mcpConnections, setMcpConnections] = useRecoilState(mcpState);
  const [hasMcpInitialized, setMcpInitialized] = useRecoilState(hasMcpInitializedState);

  // Add this to see when the hook's state is being re-initialized
  useEffect(() => {
    console.log('useMcpInitialization mounted/re-initialized. hasMcpInitialized starts as:', hasMcpInitialized);
    return () => {
      console.log('useMcpInitialization unmounted/cleaned up. hasMcpInitialized was:', hasMcpInitialized);
    };
  }, []); // Empty dependency array means it runs once on mount and once on unmount


  useEffect(() => {
    // Only initialize if it hasn't been done already and connections are available
    if (!hasMcpInitialized && config?.features?.mcp?.connections) {
      const connections: IMcp[] =
        config.features.mcp.connections.map((conn) => ({
          name: conn.name,
          clientType: conn.clientType,
          command: conn.fullCommand,
          url: conn.url,
          env: conn.env,
          tools: [],
          status: 'connected' as const
        }));

      console.log(`Initializing MCP connections with remote config: ${connections} - ${hasMcpInitialized}`,);
      setMcpConnections(connections);
      setMcpInitialized(true);
    } else {
      console.log(`Not initializing MCP connections with remote config: ${config} - ${hasMcpInitialized}`,);
    }
  }, [hasMcpInitialized, config, setMcpConnections, setMcpInitialized]); // Added all dependencies

  return { mcpConnections };
};
