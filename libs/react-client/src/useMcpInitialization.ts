import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { mcpState } from './state';
import { IMcp } from './types';
import { useConfig } from './useConfig';

export const useMcpInitialization = () => {
  const { config } = useConfig();
  const [mcpConnections, setMcpConnections] = useRecoilState(mcpState);

  useEffect(() => {
    // Check if localStorage is empty and config has initial connections
    const savedValue = localStorage.getItem('mcp_storage_key');
    const hasStoredConnections =
      savedValue && savedValue.length > 0 && savedValue !== '[]';

    if (
      config?.features?.mcp?.initial_connections &&
      !hasStoredConnections &&
      mcpConnections.length === 0
    ) {
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
        'Setting initial MCP connections from config:',
        initialConnections
      );
      setMcpConnections(initialConnections);

      // Explicitly update localStorage to ensure it's saved
      localStorage.setItem(
        'mcp_storage_key',
        JSON.stringify(initialConnections)
      );
      console.log(
        'Updated mcp_storage_key in localStorage:',
        initialConnections
      );
    }
  }, [config, mcpConnections.length, setMcpConnections]);

  return { mcpConnections };
};
