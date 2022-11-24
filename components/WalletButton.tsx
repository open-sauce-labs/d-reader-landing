import React from 'react'
import { Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import useServerAuthorization from 'hooks/useServerAuthorization'
import { lsRemoveWalletAuth } from 'utils/localStorage'
import { useAuth } from 'providers/AuthProvider'
import http, { removeAuthHeaders } from 'api/http'
import dynamic from 'next/dynamic'
import { Account } from 'providers/MobileWalletProvider'

const CrossDeviceWalletMultiButtonDynamic = dynamic(
	async () => (await import('components/wallet/CrossDeviceWalletMultiButton')).default,
	{ ssr: false }
)

const WalletButton: React.FC<{ className?: string }> = ({ className }) => {
	const { setIsAuthenticated } = useAuth()
	const { mobileConnect } = useServerAuthorization(http)

	const onAuthorize = async (mobileWallet: Web3MobileWallet, account: Account) => {
		// TODO: deprecate setIsAuthenticated(true)
		setIsAuthenticated(true)
		await mobileConnect(mobileWallet, account)
	}

	const onDeauthorize = (account: Account) => {
		setIsAuthenticated(false)
		removeAuthHeaders(http)
		if (account?.address) lsRemoveWalletAuth(account.address)
	}

	return (
		<CrossDeviceWalletMultiButtonDynamic
			className={`wallet-button ${className || ''}`}
			onAuthorize={onAuthorize}
			onDeauthorize={onDeauthorize}
		/>
	)
}

export default WalletButton
