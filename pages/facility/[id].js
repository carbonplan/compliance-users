import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Results from '../../components/results'
import useStore from '../../components/store'

const Facility = () => {
  const router = useRouter()
  const id = router.query.id

  const search = useStore((state) => state.search)
  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)
  const setSearch = useStore((state) => state.setSearch)
  const searchId = useStore((state) => state.searchId)

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath && as === '/facility') {
        setSearch('')
      }
      return true
    })

    return () => {
      router.beforePopState(() => true)
    }
  }, [router])

  useEffect(() => {
    if (!searchBy.facility)
      setSearchBy({ project: false, user: false, facility: true })
    setShowResultsBy({
      user: true,
    })
  }, [id])

  useEffect(() => {
    if ((id && id !== searchId) || (id && search === '')) setSearch(id)
  }, [id])

  return <Results />
}

export default Facility