import { Box } from 'theme-ui'
import {
  Layout as BaseLayout,
  Guide,
  Row,
  Column,
  Button,
  Link,
} from '@carbonplan/components'
import { Left } from '@carbonplan/icons'
import QuickLook from './quick-look'

const prefix = 'https://images.carbonplan.org'

const meta = {
  id: 'compliance-users',
  title: 'Compliance users',
  color: 'blue',
  card: 'compliance-users',
  quickLook: 'Tracking the users of compliance offsets',
}

const description = (
  <span>
    In the California cap-and-trade program, polluting entities use carbon
    offsets for compliance. Who are they? This tool lets you search for an
    offset project, user, or facility, and see the linked results. Read more in
    our original{' '}
    <Link href='https://carbonplan.org/blog/compliance-users-release'>
      blog post
    </Link>{' '}
    or checkout the{' '}
    <Link href='https://github.com/carbonplan/compliance-users'>
      GitHub repository
    </Link>
    . This tool was updated as of December 2024.
  </span>
)

const contentWidth = [6, 8, 10, 10]
const descriptionWidth = [6, 7, 7, 7]
const quickLookStart = 9

const Layout = ({ children }) => {
  return (
    <BaseLayout
      card={`${prefix}/social/${meta.card}.png`}
      metadata={false}
      description={meta.quickLook + '.'}
      title={meta.title + ' – CarbonPlan'}
      links={'local'}
      nav={'research'}
    >
      <Guide />
      <Row sx={{ mb: [3, 4, 5, 6] }}>
        <Box sx={{ display: ['initial', 'initial', 'initial', 'initial'] }}>
          <Column
            start={[1, 1]}
            width={[2]}
            dr={1}
            sx={{ mb: [-2, -4, 0, 0], mt: [3, 4, '109px', '154px'] }}
          >
            <Button
              href={'/research'}
              inverted
              size='xs'
              prefix={<Left />}
              sx={{ ml: ['-2px', '-2px', '-2px', '-2px'] }}
            >
              Back
            </Button>
          </Column>
        </Box>
        <Column start={[1, 2]} width={descriptionWidth}>
          <Box sx={{}}>
            <Box as='h1' variant='styles.h1' sx={{ mt: [5, 7, 7, 8] }}>
              {meta.title}
            </Box>
            <Box sx={{ mb: [0, 0, 4], mt: [0, 0, 5, 6] }}>
              <Box as='p' variant='styles.p'>
                {description}
              </Box>
            </Box>
          </Box>
        </Column>
        <QuickLook start={quickLookStart} color={meta.color} tool={true}>
          {meta.quickLook}
        </QuickLook>
      </Row>
      <Row>
        <Column start={[1, 2]} width={contentWidth}>
          {children}
        </Column>
      </Row>
    </BaseLayout>
  )
}

export default Layout
