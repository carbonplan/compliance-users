import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider } from 'theme-ui'
import { Input } from '@carbonplan/components'
import { shade } from '@theme-ui/color'
import { useKey } from 'react-use'
import useStore from './use-store'

const getMatches = (search, targets) => {
  let matches = targets.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase()),
  )
  return matches
}

const getUniqueKey = (search, obj1, obj2, obj3) => {
  if (obj1[search]) {
    return search
  } else if (obj2[search]) {
    return obj2[search]
  } else if (obj3 && obj3[search]) {
    return obj3[search]
  }
}

const isEmpty = (preview) => {
  return preview.length === 1 && preview[0].includes('no matching')
}

const PreviewResult = ({
  result,
  search,
  highlight,
  setSearch,
  setUniqueId,
  onMouseOver,
}) => {
  const sx = {
    base: {
      width: 'fit-content',
      color: highlight ? 'primary' : 'secondary',
      fontSize: [1, 1, 1, 2],
      pr: [3],
      fontFamily: 'mono',
      letterSpacing: 'mono',
    },
    active: {
      cursor: 'pointer',
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
          color: 'primary',
        },
        '&:hover > #inner': {
          color: 'primary',
        },
      },
    },
  }

  if (result.toLowerCase().includes(search.toLowerCase())) {
    const i = result.toLowerCase().indexOf(search.toLowerCase())
    const j = search.length
    return (
      <Box
        sx={{ ...sx.base, ...sx.active }}
        onMouseOver={onMouseOver}
        onClick={() => {
          setSearch(result)
          setUniqueId(result)
        }}
      >
        <Box as='span'>{result.slice(0, i)}</Box>
        <Box
          as='span'
          id='inner'
          sx={{ color: highlight ? 'primary' : shade('primary', 0.2) }}
        >
          {result.slice(i, i + j)}
        </Box>
        <Box as='span'>{result.slice(i + j)}</Box>
      </Box>
    )
  } else {
    return <Box sx={sx.base}>{result}</Box>
  }
}

const Search = () => {
  const { push } = useRouter()
  const [preview, setPreview] = useState([])
  const [highlighted, setHighlighted] = useState(-1)

  useKey('/', (e) => {
    e.preventDefault()
    input.current.focus()
  })

  useKey(
    'Enter',
    (e) => {
      if (preview.length == 0) return
      if (
        (preview.length === 1 && highlighted === -1) ||
        (preview.length === 1 && highlighted === 0) ||
        (preview.length > 1 && highlighted !== -1)
      ) {
        e.preventDefault()
        const result = highlighted == -1 ? preview[0] : preview[highlighted]
        setSearch(result)
        setUniqueId(result)
      }
    },
    {},
    [preview, highlighted],
  )

  useKey(
    'ArrowDown',
    (e) => {
      if (preview.length == 0 || isEmpty(preview)) return
      e.preventDefault()
      input.current.blur()
      list.current.focus()
      setHighlighted((prev) => {
        return Math.min(prev + 1, Math.min(preview.length - 1, 6))
      })
    },
    {},
    [preview],
  )

  useKey(
    'ArrowUp',
    (e) => {
      if (preview.length == 0 || isEmpty(preview)) return
      e.preventDefault()
      input.current.blur()
      list.current.focus()
      setHighlighted((prev) => {
        if (prev === -1) return Math.min(preview.length, 6)
        else return Math.max(prev - 1, 0)
      })
    },
    {},
    [preview],
  )

  const input = useRef(null)
  const list = useRef(null)

  const data = useStore((state) => state.data)
  const search = useStore((state) => state.search)
  const searchId = useStore((state) => state.searchId)
  const searchBy = useStore((state) => state.searchBy)
  const setSearch = useStore((state) => state.setSearch)
  const setSearchId = useStore((state) => state.setSearchId)

  const getSearchId = (match) => {
    let id
    if (searchBy.project) {
      id = getUniqueKey(
        match,
        data.opr_to_arbs,
        data.arb_to_oprs,
        data.project_name_to_opr,
      )
    }
    if (searchBy.user) {
      id = getUniqueKey(match, data.user_to_arbs, data.user_name_to_id)
    }
    if (searchBy.facility) {
      id = getUniqueKey(match, data.facility_to_user, data.facility_name_to_id)
    }
    return id
  }

  const setUniqueId = (match) => {
    const id = getSearchId(match)
    if (searchBy.project) {
      setSearchId(id)
      push(`/research/compliance-users/project/${id}`, null, { scroll: false })
    }
    if (searchBy.user) {
      setSearchId(id)
      push(`/research/compliance-users/user/${id}`, null, { scroll: false })
    }
    if (searchBy.facility) {
      setSearchId(id)
      push(`/research/compliance-users/facility/${id}`, null, { scroll: false })
    }
  }

  useEffect(() => {
    if (!data) return
    if (search === '') {
      setPreview([])
      return
    }
    if (getSearchId(search) === searchId) {
      setPreview([])
      return
    }
    if (searchBy.project) {
      let matches = getMatches(search, data.project_targets)
      if (matches.length > 1) {
        setPreview(matches)
      } else if (matches.length === 1) {
        setPreview(matches)
      } else {
        setPreview(['no matching projects'])
      }
    }
    if (searchBy.user) {
      let matches = getMatches(search, data.user_targets)
      if (matches.length > 1) {
        setPreview(matches)
      } else if (matches.length === 1) {
        setPreview(matches)
      } else {
        setPreview(['no matching users'])
      }
    }
    if (searchBy.facility) {
      let matches = getMatches(search, data.facility_targets)
      if (matches.length > 1) {
        setPreview(matches)
      } else if (matches.length === 1) {
        setPreview(matches)
      } else {
        setPreview(['no matching facilities'])
      }
    }
  }, [data, search, searchId, searchBy])

  return (
    <>
      <Box
        sx={{
          ml: [0, 3, 3, 3],
          mt: ['12px', 0, 0, '-2px'],
          mb: [1],
          pb: ['2px', 0, 0, '2px'],
          flexGrow: 1,
          width: ['1px', 'unset', 'unset', 'unset'],
          borderBottom: ({ colors }) => `solid 1px ${colors.muted}`,
        }}
      >
        <Input
          ref={input}
          placeholder={'enter search term'}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
          onFocus={(e) => {
            setHighlighted(-1)
          }}
          value={search}
          sx={{
            borderStyle: 'none',
            fontFamily: 'mono',
            fontSize: [1, 1, 1, 2],
            pt: [1],
            letterSpacing: 'mono',
            width: '100%',
          }}
        />
        {preview.length > 0 && (
          <Box
            sx={{ pt: [2], mb: [3], outline: 'none !important' }}
            ref={list}
            tabIndex='0'
            onKeyDown={(e) => {
              if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.code)) {
                input.current.focus()
                setHighlighted(-1)
              }
            }}
          >
            {preview.slice(0, 7).map((d, i) => {
              return (
                <PreviewResult
                  key={i}
                  result={d}
                  highlight={i === highlighted}
                  search={search}
                  setSearch={setSearch}
                  setUniqueId={setUniqueId}
                  onMouseOver={() => {
                    setHighlighted(-1)
                  }}
                  onMouseEnter={() => {
                    setHighlighted(-1)
                  }}
                />
              )
            })}
            {preview.length > 7 && (
              <Box
                sx={{
                  color: 'secondary',
                  fontSize: [1, 1, 1, 2],
                  fontFamily: 'mono',
                  letterSpacing: 'mono',
                }}
              >
                <br />+{preview.length - 7} more
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Divider />
    </>
  )
}

export default Search
