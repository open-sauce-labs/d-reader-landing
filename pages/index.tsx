import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import { useFetchApp } from 'api/app'
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	Grid,
	Hidden,
	StandardTextFieldProps,
	TextField,
	Typography,
} from '@mui/material'
import phoneImage from 'public/assets/phone.png'
import comingSoonGooglePlayImage from 'public/assets/coming-soon-google-play.png'
import { Formik, Form, FieldAttributes, FormikTouched, FormikErrors, Field } from 'formik'
import TextImportant from 'components/TextImportant'
import WalletButton from 'components/WalletButton'
import { useAuth } from 'providers/AuthProvider'
import useToggle from 'hooks/useToggle'
import Image from 'next/image'
import { SchemaOf } from 'yup'
import * as yup from 'yup'

interface SubscribeRequest {
	email: string
	wantsFreeNFTs: boolean
	wantsDevelopmentProgressNews: boolean
	wantsPlatformContentNews: boolean
}

const validationSchema: SchemaOf<SubscribeRequest> = yup.object({
	email: yup.string().email('invalid email format').required('email is required'),
	wantsFreeNFTs: yup.boolean().required('required'),
	wantsDevelopmentProgressNews: yup.boolean().required('required'),
	wantsPlatformContentNews: yup.boolean().required('required'),
})

const initialValues: SubscribeRequest = {
	email: '',
	wantsFreeNFTs: false,
	wantsDevelopmentProgressNews: true,
	wantsPlatformContentNews: false,
}

const Home: NextPage = () => {
	useFetchApp()
	const auth = useAuth()
	const [subscriptionDetailsOpen, toggleSubscriptionDetails] = useToggle()
	// const { mutateAsync: subscribe, isLoading } = useNewsletterSubscription()

	return (
		<Box className='content'>
			<Navigation />

			<Main className='main'>
				<Grid
					container
					maxWidth='lg'
					margin='0 auto'
					sx={{
						flexDirection: {
							xs: 'row',
							sm: 'row-reverse',
						},
					}}
					pb={4}
				>
					<Grid item xs={12} sm={7} md={6} className='newsletter-column newsletter-column--right'>
						<Typography className='newsletter-subtitle' variant='subtitle1'>
							on-chain solution for graphic novels
						</Typography>
						<Typography className='text--important newsletter-title' variant='h1'>
							<Hidden smUp>Join the digital comic revolution!</Hidden>
							<Hidden smDown>
								Join the
								<br />
								digital comic revolution!
							</Hidden>
						</Typography>
						<Typography className='newsletter-body' variant='body1'>
							dReader is set on a journey to become the main destination for discovering, trading, creating and
							consuming Digital Comics.
							<Hidden mdDown> Help us shape the future of graphic novels and empower artists!</Hidden>
						</Typography>
						<Box>
							<Hidden smDown>
								<SubscribeLabel />
							</Hidden>
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={async (values) => {
									console.log('Subscribed!: ', values)
								}}
							>
								{({ errors, touched, setFieldTouched, validateForm }) => (
									<Form noValidate className='newsletter-form'>
										<FormField
											property='email'
											label='e-mail'
											type='email'
											className='newsletter-email-input'
											errors={errors}
											touched={touched}
											required
										/>

										{auth.isAuthenticated ? (
											<Button
												type='button'
												variant='contained'
												className='button--subscribe'
												disabled={!auth.isAuthenticated}
												onClick={async () => {
													setFieldTouched('email', true)
													validateForm().then((err: FormikErrors<SubscribeRequest>) => {
														if (!!err.email) return
														toggleSubscriptionDetails()
													})
												}}
											>
												Subscribe
											</Button>
										) : (
											<WalletButton className='button--subscribe' />
										)}

										<Dialog
											style={{ backdropFilter: 'blur(4px)' }}
											open={subscriptionDetailsOpen}
											onClose={toggleSubscriptionDetails}
											PaperProps={{ className: 'newsletter-details-dialog' }}
										>
											<label className='newsletter-checkbox-label'>
												<FormCheckboxField
													property='wantsDevelopmentProgressNews'
													className='newsletter-checkbox'
													errors={errors}
													touched={touched}
												/>
												<span>
													I want to receive latest news about the <TextImportant>project development</TextImportant>
													<br />
													<em>milestones, roadmap updates, grant applications...</em>
												</span>
											</label>
											<label className='newsletter-checkbox-label'>
												<FormCheckboxField
													property='wantsPlatformContentNews'
													className='newsletter-checkbox'
													errors={errors}
													touched={touched}
												/>
												<span>
													I want to receive alpha news on <TextImportant>platform content</TextImportant>
													<br />
													<em>new artists, comics, collaborations...</em>
												</span>
											</label>
											<label className='newsletter-checkbox-label'>
												<FormCheckboxField
													property='wantsFreeNFTs'
													className='newsletter-checkbox'
													errors={errors}
													touched={touched}
												/>
												<span>
													I want to participate in <TextImportant>free NFT drops</TextImportant>
												</span>
											</label>
											<Button
												type='submit'
												variant='contained'
												fullWidth
												className='button--request-access'
												disabled={!auth.isAuthenticated}
											>
												Request Access
											</Button>
										</Dialog>
									</Form>
								)}
							</Formik>
							<Hidden smUp>
								<SubscribeLabel />
							</Hidden>
						</Box>
					</Grid>
					<Grid item xs={12} sm={5} md={6}>
						<Box className='newsletter-column newsletter-column--left'>
							<Image src={phoneImage} width={910} height={1120} alt='' />
							<Image
								src={comingSoonGooglePlayImage}
								width={854}
								height={246}
								alt='Coming soon on Google Play'
								className='google-image'
							/>
						</Box>
					</Grid>
				</Grid>
			</Main>

			<Footer />
		</Box>
	)
}

type FormFieldProps<T> = Omit<
	FieldAttributes<StandardTextFieldProps> & {
		property: keyof T
		touched: FormikTouched<T>
		errors: FormikErrors<T>
	},
	'name'
>

const FormField: React.FC<FormFieldProps<Pick<SubscribeRequest, 'email'>>> = ({
	property,
	touched,
	errors,
	...props
}) => {
	return (
		<Field
			id={property}
			name={property}
			autoComplete={property}
			margin='normal'
			variant='outlined'
			size='small'
			error={touched[property] && Boolean(errors[property])}
			helperText={touched[property] && errors[property]}
			as={TextField}
			{...props}
		/>
	)
}

const FormCheckboxField: React.FC<FormFieldProps<Omit<SubscribeRequest, 'email'>>> = ({
	property,
	touched,
	errors,
	...props
}) => {
	return (
		<Field
			type='checkbox'
			id={property}
			name={property}
			error={touched[property] && Boolean(errors[property])}
			as={Checkbox}
			{...props}
		/>
	)
}

const SubscribeLabel = () => {
	return (
		<Typography className='newsletter-subscribe-label' fontStyle='italic' variant='body1'>
			<TextImportant>Connect wallet</TextImportant> and <TextImportant>Subscribe</TextImportant> to secure your place as
			an early adopter and apply for free NFT drops.
		</Typography>
	)
}

export default Home
