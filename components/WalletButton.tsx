import React from 'react'
import { Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { useAuth, useServerAuthorization, Account, removeAuthHeaders, lsRemoveWalletAuth } from '@open-sauce/solomon'
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import http from 'api/http'

const WalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-material-ui')).WalletMultiButton,
	{ ssr: false }
)

const MobileWalletMultiButtonDynamic = dynamic(
	async () => await (await import('@open-sauce/solomon')).MobileWalletMultiButton,
	{ ssr: false }
)

const WalletButton: React.FC<{ className?: string }> = ({ className }) => {
	const { setIsAuthenticated } = useAuth()
	const { mobileConnect } = useServerAuthorization(http)
	const { wallet } = useWallet()
	const isMobileWallet = wallet?.adapter.name === SolanaMobileWalletAdapterWalletName

	const onAuthorize = async (mobileWallet: Web3MobileWallet, account: Account) => {
		// TODO: deprecate setIsAuthenticated(true)
		setIsAuthenticated(true)
		return await mobileConnect(mobileWallet, account)
	}

	const onDeauthorize = (account: Account) => {
		setIsAuthenticated(false)
		removeAuthHeaders(http)
		if (account?.address) lsRemoveWalletAuth(account.address)
	}

	if (isMobileWallet) {
		return (
			<MobileWalletMultiButtonDynamic
				className={`wallet-button ${className || ''}`}
				onAuthorize={onAuthorize}
				onDeauthorize={onDeauthorize}
			/>
		)
	}

	return <WalletMultiButtonDynamic variant='contained' className={`wallet-button ${className || ''}`} />
}

export default WalletButton
