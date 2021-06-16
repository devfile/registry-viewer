import Meta from '@components/page/Meta'

import Link from 'next/link'
import { Text, TextContent, Brand, Page, PageHeader, PageHeaderTools, PageSection, PageSectionVariants } from '@patternfly/react-core'

import mainPageLogo from '../../public/images/mainPageLogo.svg'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props): React.ReactElement => {
  const Header = (
    <PageHeader
      logo={
        <Brand src={mainPageLogo} alt="Devfile Registry Logo" className="h-full"/>
      }
      headerTools={
        <PageHeaderTools>
          <Link href='/'>
            <a data-test-id="go-home-button">
              <TextContent>
                <Text>Devfile Registry</Text>
              </TextContent>
            </a>
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
