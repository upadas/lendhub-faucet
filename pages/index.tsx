import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>LendHub Faucet</title>
        <meta name="description" content="Can get assets before testing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <section>
            <h1 className='text-white text-5xl'>LendHub Faucet</h1>
            <p className='text-ellipsis text-center'>Enjoy 1 ETH Per day and 10 of each DAI, USDC, LINK</p>
          </section>
          
          {/* <section>
            <h1 className='text-white text-center px-20'>LendHub Faucet</h1>
            <p className='text-ellipsis text-center'>Enjoy 1 ETH Per day and 10 of each DAI, USDC, LINK</p>
          </section> */}

        </div>
      </main>
    </>
  )
}
