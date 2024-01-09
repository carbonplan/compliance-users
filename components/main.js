import { Box, Divider } from 'theme-ui'
import { Row, Column, Filter, Group } from '@carbonplan/components'
import { sx, colors } from './styles'
import Target from './target'
import Results from './results'
import useStore from './use-store'
import { useMemo } from 'react'

const Main = () => {
  const data = useStore((state) => state.data)
  const searchId = useStore((state) => state.searchId)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const reportingPeriods = useStore((state) => state.reportingPeriods)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)
  const setReportingPeriods = useStore((state) => state.setReportingPeriods)

  const order = useMemo(
    () =>
      Object.keys(reportingPeriods).sort(
        (a, b) => Number(a.split('-')[0]) - Number(b.split('-')[0]),
      ),
    [reportingPeriods],
  )
  return (
    <>
      <Box>
        {data && searchId && (
          <Box>
            <Row columns={[6, 8, 10, 10]}>
              <Column
                start={[1, 1, 1, 1]}
                width={[6, 3, 3, 3]}
                sx={{
                  position: ['unset', 'sticky', 'sticky', 'sticky'],
                  top: 84,
                  height: 300,
                }}
              >
                <Group spacing='md'>
                  <Box>
                    <Divider sx={{ mb: [3] }} />
                    <Target />
                    <Divider sx={{ mt: [3] }} />
                  </Box>
                  <Box>
                    <Box sx={sx.label}>Show results by</Box>
                    {data.user_id_to_name[searchId] && (
                      <Filter
                        values={showResultsBy}
                        setValues={setShowResultsBy}
                        colors={colors}
                      />
                    )}
                    {!data.user_id_to_name[searchId] && (
                      <Filter
                        values={{ user: true }}
                        setValues={() => {}}
                        colors={colors}
                      />
                    )}
                  </Box>
                  <Box>
                    <Box sx={sx.label}>Reporting periods</Box>
                    <Filter
                      order={order}
                      values={reportingPeriods}
                      setValues={setReportingPeriods}
                      multiSelect
                    />
                  </Box>
                </Group>
              </Column>
              <Column id='right' start={[1, 4, 5, 5]} width={[6, 5, 5, 5]}>
                <Divider sx={{ mb: [3] }} />
                <Results />
                <Divider sx={{ mt: [3] }} />
              </Column>
            </Row>
          </Box>
        )}
      </Box>
      {!data && <Box sx={sx.label}>Loading data...</Box>}
    </>
  )
}

export default Main
