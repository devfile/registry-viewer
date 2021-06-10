import Meta from '@components/page/Meta'

import Link from 'next/link'
import { Brand, Page, PageHeader, PageHeaderTools, PageSection, PageSectionVariants } from '@patternfly/react-core'

import mainPageLogo from '../../public/mainPageLogo.svg'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props): React.ReactElement => {
  const logoProps = {
    href: '',
    onClick: () => console.log('clicked logo'),
    target: '_blank'
  }

  const Header = (
    <PageHeader
      logo={
        <Brand src={mainPageLogo} alt="Devfile Registry Logo" className="h-full"/>
      }
      logoProps={logoProps}
      headerTools={
        <PageHeaderTools>
          <Link href='/'>
            <a>Devfile Registry</a>
          </Link>
        </PageHeaderTools>
      }
    />
  )

  return (
    <Page header={Header}>
      <Meta />
      <PageSection variant={PageSectionVariants.light}>
        <main>
          {children}
        </main>
      </PageSection>
    </Page>
  )
}

export default Layout
