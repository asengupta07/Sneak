"use client"

import React from 'react';

import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { avalancheFuji } from 'viem/chains';
import { theme } from '../constants/theme';

const config = createConfig(
    getDefaultConfig({
        appName: 'Sneak',
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        chains: [avalancheFuji]
    })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider debugMode customTheme={theme}>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};