import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { mcpState } from './state';
import { IMcp } from './types';
import { useConfig } from './useConfig';
import { useChatSession } from './useChatSession';

export const useMcpInitialization = () => {
  const { config } = useConfig();
  const [mcpConnections, setMcpConnections] = useRecoilState(mcpState);

    useEffect(() => {
    // Always override localStorage with remote config data when available
    if (config?.features?.mcp?.initial_connections) {
      console.log('config', config);
      const initialConnections: IMcp[] =
        config.features.mcp.initial_connections.map((conn) => ({
          name: conn.name,
          clientType: conn.clientType,
          command: conn.fullCommand,
          url: conn.url,
          env: conn.env,
          tools: [],
          status: 'connecting' as const
        }));

      console.log(
        'Overriding MCP connections with remote config:',
        initialConnections
      );
      setMcpConnections(initialConnections);

      // Always update localStorage to match remote config
      localStorage.setItem(
        'mcp_storage_key',
        JSON.stringify(initialConnections)
      );
      console.log(
        'Overrode mcp_storage_key in localStorage with remote config:',
        initialConnections
      );
    }
  }, [config, setMcpConnections]);

  return { mcpConnections };
};
