import React, {useEffect, useState} from 'react';
import MapHeader from "../components/map/MapHeader";
import SwitchUI from "../components/UI/SwitchUI";
import {message, Select} from "antd";
import {useTopVisor} from "../hooks/useTopVisor";
import PageIsLoading from "../components/PageIsLoading";
import MapNoData from "../components/map/MapNoData";
import IconArrowUp from "../components/icons/IconArrowUp";
import IconArrowDown from "../components/icons/IconArrowDown";
import IconMark from "../components/icons/iconMark";
import IconCross from "../components/icons/IconCross";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import {useParams} from "react-router";
import {useSearchParams} from "react-router-dom";
import {emptyRegions} from "../components/map/emptyRegions";
import {moscowEmpty} from "../components/map/moscowRegions";

const Map = () => {
    const [rightMenuIsOpen, setRightMenuIsOpen] = useState(true)
    const [selectedFilter, setSelectedFilter] = useState(2)
    const [rightMenuSwitch, setRightMenuSwitch] = useState('region')
    const [keywords, setKeywords] = useState([])
    const [searchSystem, setSearchSystem] = useState(0)
    const [deviceType, setDeviceType] = useState(0)
    const [requestsPart, setRequestsPart] = useState(50)
    const [requestsPartTop, setRequestsPartTop] = useState(3)
    const [dynamicCount, setDynamicCount] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)
    const [regionsSummaryFiltered, setRegionsSummaryFiltered] = useState([])
    const [lastUpdate, setLastUpdate] = useState('')
    const [regionsSummaryYa, setRegionsSummaryYa] = useState({ arr: [], ready: false })
    const [regionsSummaryYaMob, setRegionsSummaryYaMob] = useState({ arr: [], ready: false })
    const [regionsSummaryG, setRegionsSummaryG] = useState({ arr: [], ready: false })
    const [regionsSummaryGMob, setRegionsSummaryGMob] = useState({ arr: [], ready: false })
    const [keywordsStat, setKeywordsStat] = useState([])
    const [keywordsListIsLoading, setKeywordsListIsLoading] = useState(true)
    const [regionsForDl, setRegionsForDl] = useState([])
    const [regionsForDlGoogle, setRegionsForDlGoogle] = useState([])
    const [keywordsForDl, setKeywordsForDl] = useState([])
    const [keywordsForDlGoogle, setKeywordsForDlGoogle] = useState([])
    const [keywordFilter, setKeywordFilter] = useState(null)
    const [curKeyword, setCurKeyword] = useState(null)
    const [mainTopFilter, setMainTopFilter] = useState(3)
    const [selectedRegion, setSelectedRegion] = useState({ key: -1, index: -1 })
	const [selectedMap, setSelectedMap] = useState(0)
	const [groupList, setGroupList] = useState([])
	const [groupsFilter, setGroupsFilter] = useState(-1)
	const [groupsForDl, setGroupsForDl] = useState({})
	const [groupIsLoading, setGroupIsLoading] = useState(false)
	const [existsDates, setExistsDates] = useState([])
	const [selectedDate, setSelectedDate] = useState(null)

	const params = useParams()

    let dt = new Date()
    let today = dt.getFullYear() + '-' +
        (dt.getMonth() < 9 ? (dt.getMonth() + 1).toString().padStart(2, '0') : dt.getMonth() + 1) + '-' +
        (dt.getDate() < 10 ? dt.getDate().toString().padStart(2, '0') : dt.getDate())
    let yesterday = dt.getFullYear() + '-' +
        (dt.getMonth() < 9 ? (dt.getMonth() + 1).toString().padStart(2, '0') : dt.getMonth() + 1) + '-' +
        ((dt.getDate()-1) < 9 ? (dt.getDate()-1).toString().padStart(2, '0') : (dt.getDate()-1))

	const [searchParams, setSearchParams] = useSearchParams();
    const projectId = searchParams.get('id');

    //regions 7985794
    //rd 7417310
    //random 6908734
	//mskRegionsNew 8467340


    const [projectRegions, setProjectRegions] = useState([])
    const [filteredRegions, setFilteredRegions] = useState([])

    const [getTopVisorData, topVisorDataIsLoading] = useTopVisor({
        url: '/get/positions_2/history',
        data: {
            project_id: projectId,
            //regions_indexes: regionsSummaryFiltered.map(el => { return el.index }),
            date1: selectedDate ? selectedDate : lastUpdate === today ? yesterday : lastUpdate,
            date2: selectedDate ? selectedDate : today,
            show_exists_dates: 1,
            positions_fields: ["position"],
            fields: ["name", "id"]
        }
    })

    useEffect(() => {
        console.log(projectRegions)
    },[projectRegions])

    const [getSummary] = useTopVisor({
        url: '/get/positions_2/summary',
        data: {
            project_id: projectId,
            show_tops: 1,
			show_dynamics: 1,
			show_visibility: 1,
            dates: [selectedDate ? selectedDate : lastUpdate === today ? yesterday : lastUpdate, selectedDate ? selectedDate : today]
        }
    })

	const [getGroupSummary] = useTopVisor({
		url: '/get/positions_2/summary_chart',
		data: {
			project_id: projectId,
			show_visibility: 1,
			dates: [selectedDate ? selectedDate : lastUpdate, selectedDate ? selectedDate : today],
			filters:[{
				name: "group_id",
				operator: "EQUALS",
				values: [ groupsFilter ]
			}]
		}
	})

    const [getProjectsList, projectsListIsLoading] = useTopVisor({
        url: '/get/projects_2/projects',
        data: {
            fields: ["name", 'id']
        }
    })

    const [getKeywords, keywordsIsLoading] = useTopVisor({
        url: '/get/keywords_2/keywords',
        data: {
            project_id: projectId,
            fields: ["name", 'id', "group_id", "group_on"],
            status_positions: 1,
			/*filters:[{
				name: "project_id",
				operator: "EQUALS",
				values: [ projectId ]
			}]*/
        }
    })

	const [getGroupsList, groupsListIsLoading] = useTopVisor({
		url: '/get/keywords_2/groups',
		data: {
			project_id: projectId,
			fields: ["name", 'id', 'on', "folder_id", "folder_path"],
			/*"filters":[{
				"name": "project_id",
				"operator": "EQUALS",
				"values": [ projectId ]
			}]*/
		}
	})

	const [getFoldersList, groupsFoldersIsLoading] = useTopVisor({
		url: '/get/keywords_2/folders',
		data: {
			project_id: projectId,
			/*"filters":[{
				"name": "project_id",
				"operator": "EQUALS",
				"values": [ projectId ]
			}]*/
		}
	})

    const [getProjectsData, projectsDataIsLoading] = useTopVisor({
        url: '/get/projects_2/projects',
        data: {
            fields: ["name", "positions_time", 'status_positions'],
            show_searchers_and_regions: 1,
            status_positions: 1,
            id: projectId,
            include_positions_summary_params: ['status_positions', 'positions_time'],
        }
    })

    useEffect(() => {
    	if (selectedDate) {
			setRegionsSummaryYa({ arr: [], ready: false })
			setRegionsSummaryYaMob({ arr: [], ready: false })
			setRegionsSummaryG({ arr: [], ready: false })
			setRegionsSummaryGMob({ arr: [], ready: false })
			setRegionsSummaryFiltered([])
			setKeywordsListIsLoading(true)
		}
		getProjectsData().then(resp => {
			if (resp.errors) {
				message.error(resp.errors[0].string)
			} else if (resp.result.length === 0) { message.error('Проекта с id ' + params.id + ' не существует') } else {
				let tmpArr = [...emptyRegions]
				let tmpArr2 = [...moscowEmpty]
				setProjectRegions(resp.result[0])
				setKeywordsForDl(resp.result[0].searchers[0].regions.map(el => el.index))
				if (resp.result[0].searchers.length > 1) {
					setKeywordsForDlGoogle(resp.result[0].searchers[1].regions.map(el => el.index))
				}
				setDynamicCount(resp.result[0].positions_summary.dynamics.all)
				if (selectedDate) {
					setLastUpdate(selectedDate)
				} else {
					setLastUpdate(resp.result[0].positions_time ? resp.result[0].positions_time.split(' ')[0] : today)
				}
				if (resp.result[0].searchers.length) {
					setRegionsForDl(resp.result[0].searchers[0].regions.map(el => {
						return { regionIndex: el.index, key: el.key, name: el.name, device: el.device }
					}))
					if (resp.result[0].searchers.length > 1) {
						setRegionsForDlGoogle(resp.result[0].searchers[1].regions.map(el => {
							return { regionIndex: el.index, key: el.key, name: el.name, device: el.device }
						}))
					}
				}
				resp.result[0].searchers[searchSystem].regions.forEach(el => {
					if (el.device === deviceType) {
						tmpArr = tmpArr.map(reg => {
							return reg.key === el.key ? {...reg,
								isSelected: true,
								name: el.name,
								areaName: el.areaName.split(',')[0],
								index: el.index,
								top: el.positions_summary.tops,
							} : reg
						})
						tmpArr2 = tmpArr2.map(reg => {
							return reg.key === el.key ? {...reg,
								isSelected: true,
								name: el.name,
								areaName: el.name === 'Москва' ? el.areaName : el.areaName.split(',')[1],
								index: el.index,
								top: el.positions_summary.tops,
							} : reg
						})
					}
				})
				setRegions(tmpArr)
				console.log(tmpArr)
				setRegionsMoscow(tmpArr2)
				console.log(tmpArr2)
			}
		}).catch(err => message.error(err.message))
		getGroupsList().then(resp => {
			let groups = resp.result.filter(el => el.on === 1),
				groupsDL = {}
			groups.forEach(el => {
				groupsDL['g' + el.id + 0] = true
				groupsDL['g' + el.id + 1] = true
			})
			setGroupsForDl(groupsDL)
			console.log('---groups---')
			console.log(groups)
			setGroupList(groups)
		}).catch(err => message.error(err.message))
		getKeywords().then(resp => {
			let kl = resp.result.filter(el => el.group_on === 1)
			setKeywords(kl)
			console.log('---keywords---')
			console.log(kl)
		}).catch(err => message.error(err.message))
    }, [selectedDate])

    useEffect(() => {
        let tmp;
        if (lastUpdate && regionsForDl.length === 0 && searchSystem === 0 && !projectsDataIsLoading) {
            if (keywordsForDl.length > 0 && activeRequests < 5) {
                getTopVisorData({ regions_indexes: [keywordsForDl[0]] }).then(resp => {
                    setKeywordsStat(st => {
                        if (!st.keywords) {
                            return resp.result
                        } else {
                            return { ...st,
                                existsDates: st.existsDates.length < resp.result.existsDates.length ? resp.result.existsDates : st.existsDates,
                                keywords: st.keywords.map((el, index) => {
                                return {...el, positionsData: Object.assign({...el.positionsData}, resp.result.keywords[index].positionsData)}
                            })}
                        }
                    })
                    setActiveRequests(st => (st - 1))
                })
                setActiveRequests(st => st + 1)
                setKeywordsForDl(st => [...st].filter((el, ind) => ind !== 0))
            }
            if (lastUpdate && activeRequests === 0 && keywordsForDl.length === 0) {
                setKeywordsListIsLoading(false)
				setCurKeyword(keywordsStat.keywords.filter(el => el.id === keywordFilter)[0])
            }
        }
        if (lastUpdate && regionsForDlGoogle.length === 0 && searchSystem === 1 && !projectsDataIsLoading) {
            if (keywordsForDlGoogle.length > 0 && activeRequests < 5) {
                tmp = keywordsForDlGoogle[0];
                getTopVisorData({ regions_indexes: [keywordsForDlGoogle[0]] }).then(resp => {
                    setKeywordsStat(st => {
                        if (!st.keywords) {
                            return resp.result
                        } else {
                            return { ...st,
                                existsDates: st.existsDates.length < resp.result.existsDates.length ? resp.result.existsDates : st.existsDates,
                                keywords: st.keywords.map((el, index) => {
                                    return {...el, positionsData: Object.assign({...el.positionsData}, resp.result.keywords[index].positionsData)}
                                })}
                        }
                    })
                    setActiveRequests(st => (st - 1))
                })
                setActiveRequests(st => st + 1)
                setKeywordsForDlGoogle(st => [...st].filter((el, ind) => ind !== 0))
            }
            if (lastUpdate && activeRequests === 0 && keywordsForDl.length === 0 && searchSystem === 0) {
                setKeywordsListIsLoading(false)
                setCurKeyword(keywordsStat.keywords.filter(el => el.id === keywordFilter)[0])
				console.log(curKeyword)
            }
            if (lastUpdate && activeRequests === 0 && keywordsForDlGoogle.length === 0 && searchSystem === 1) {
                setKeywordsListIsLoading(false)
                setCurKeyword(keywordsStat.keywords.filter(el => el.id === keywordFilter)[0])
				console.log(curKeyword)
            }
        }
    },[lastUpdate, regionsForDl, regionsForDlGoogle, projectsDataIsLoading, activeRequests, searchSystem])

	useEffect(() => {
		if (!keywordsListIsLoading) {
			if (keywordsStat.existsDates.length) {
				setExistsDates(keywordsStat.existsDates)
			}
		}
	},[keywordsListIsLoading, keywordsStat])

    useEffect(() => {
        let tmp;
        if (regionsForDl.length && activeRequests < 5 && lastUpdate && searchSystem === 0) {
            tmp = regionsForDl[0];
            getSummary({ region_index: regionsForDl[0].regionIndex }).then(resp => {
                if (tmp.device === 0) {
                    setRegionsSummaryYa(st => { return {...st, arr: [...st.arr, { ...resp.result, index: tmp.regionIndex, key: tmp.key, name: tmp.name }]}})
                }
                if (tmp.device === 2) {
                    setRegionsSummaryYaMob(st => { return {...st, arr: [...st.arr, { ...resp.result, index: tmp.regionIndex, key: tmp.key, name: tmp.name }]}})
                }
                setActiveRequests(st => (st - 1))
            })
            setActiveRequests(st => st + 1)
            setRegionsForDl(st => [...st].filter((el, ind) => ind !== 0))
        }
        if (regionsForDlGoogle.length && activeRequests < 5 && lastUpdate && searchSystem === 1) {
            tmp = regionsForDlGoogle[0];
            getSummary({ region_index: regionsForDlGoogle[0].regionIndex }).then(resp => {
                if (tmp.device === 0) {
                    setRegionsSummaryG(st => { return {...st, arr: [...st.arr, { ...resp.result, index: tmp.regionIndex, key: tmp.key, name: tmp.name }]}})
                }
                if (tmp.device === 2) {
                    setRegionsSummaryGMob(st => { return {...st, arr: [...st.arr, { ...resp.result, index: tmp.regionIndex, key: tmp.key, name: tmp.name }]}})
                }
                setActiveRequests(st => (st - 1))
            })
            setActiveRequests(st => st + 1)
            setRegionsForDlGoogle(st => [...st].filter((el, ind) => ind !== 0))
        }
        if (lastUpdate && activeRequests === 0 && regionsForDl.length === 0) {
            setRegionsSummaryYa(st => { return {...st, ready: true }})
            setRegionsSummaryYaMob(st => { return {...st, ready: true }})
        }
        if (lastUpdate && activeRequests === 0 && regionsForDlGoogle.length === 0) {
            setRegionsSummaryG(st => { return {...st, ready: true }})
            setRegionsSummaryGMob(st => { return {...st, ready: true }})
        }
    },[regionsForDl, regionsForDlGoogle, activeRequests, lastUpdate, searchSystem])

    useEffect(() => {
        if (regionsSummaryYa.ready && searchSystem === 0) {
            if (deviceType === 0) {
                console.log('desk ya')
                console.log(regionsSummaryYa)
                //setRegionsSummaryFiltered(regionsSummaryYa.arr)
            } else {
                console.log('mob ya')
                console.log(regionsSummaryYaMob)
                //setRegionsSummaryFiltered(regionsSummaryYaMob.arr)
            }
        }
        if (regionsSummaryG.ready && searchSystem === 1) {
            if (deviceType === 0) {
                console.log('desk g')
                console.log(regionsSummaryG)
                //setRegionsSummaryFiltered(regionsSummaryG.arr)
            } else {
                console.log('mob g')
                console.log(regionsSummaryGMob)
                //setRegionsSummaryFiltered(regionsSummaryGMob.arr)
            }
        }
    },[regionsSummaryYa, regionsSummaryYaMob, regionsSummaryG, regionsSummaryGMob])

    useEffect(() => {
        if (searchSystem === 0 && keywordsForDl.length > 0) {
            setKeywordsListIsLoading(true)
        }
        if (searchSystem === 1 && keywordsForDlGoogle.length > 0) {
            setKeywordsListIsLoading(true)
        }
    },[searchSystem])

    useEffect(() => {
        if (regionsSummaryFiltered.length > 0 && activeRequests === 0 && lastUpdate) {
            switch (requestsPartTop) {
                case 3:
                    setFilteredRegions(regionsSummaryFiltered.filter(el => el.tops[1]['1_3']/(el?.dynamics?.all || 10000000)*100 >= requestsPart))
                    break;
                case 10:
                    setFilteredRegions(regionsSummaryFiltered.filter(el => el.tops[1]['1_10']/(el?.dynamics?.all || 10000000)*100 >= requestsPart))
                    break;
                case 30:
                    setFilteredRegions(regionsSummaryFiltered.filter(el => (el.tops[1]['1_10'] + el.tops[1]['11_30'])/(el?.dynamics?.all || 10000000)*100 >= requestsPart))
                    break;
                case 50:
                    setFilteredRegions(regionsSummaryFiltered.filter(el => (el.tops[1]['1_10'] + el.tops[1]['11_30'] + el.tops[1]['31_50'])/(el?.dynamics?.all || 10000000)*100 >= requestsPart))
                    break;
                default:
            }
        }
    },[regionsSummaryFiltered, activeRequests, lastUpdate, requestsPartTop, requestsPart])

    const [regions, setRegions] = useState(emptyRegions)
    const [regionsMoscow, setRegionsMoscow] = useState(moscowEmpty)

    useEffect(() => {
        if (projectRegions.searchers?.length > 0) {
        	if (projectRegions.searchers.length === 1 && searchSystem !== 0) {
				setRegions(emptyRegions)
				setRegionsMoscow(moscowEmpty)
			} else {
				let tmpArr = [...emptyRegions], tmpArr2 = [...moscowEmpty],
					fr = projectRegions.searchers[searchSystem].regions.filter(el => el.device === deviceType)
				fr.forEach(el => {
					tmpArr = tmpArr.map(reg => {
						return reg.key === el.key ? {...reg,
							isSelected: true,
							name: el.name,
							areaName: el.areaName.split(',')[0],
							index: el.index,
							top: el.positions_summary.tops,
						} : reg
					})
					tmpArr2 = tmpArr2.map(reg => {
						return reg.key === el.key ? {...reg,
							isSelected: true,
							name: el.name,
							index: el.index,
							areaName: el.name === 'Москва' ? el.areaName : el.areaName.split(',')[1],
							top: el.positions_summary.tops,
						} : reg
					})
				})
				setRegions(tmpArr)
				setRegionsMoscow(tmpArr2)
			}
        }
        if (searchSystem === 0) {
            if (deviceType === 0) {
                setRegionsSummaryFiltered(regionsSummaryYa.arr)
            }
            if (deviceType === 2) {
                setRegionsSummaryFiltered(regionsSummaryYaMob.arr)
            }
        } else {
            if (deviceType === 0) {
                setRegionsSummaryFiltered(regionsSummaryG.arr)
            }
            if (deviceType === 2) {
                setRegionsSummaryFiltered(regionsSummaryGMob.arr)
            }
        }

    },[searchSystem, deviceType, regionsSummaryYa, regionsSummaryYaMob, regionsSummaryG, regionsSummaryGMob])

    const getColor = (regionIndex) => {
        let color = "top0",
            region = regionsSummaryFiltered.filter(el => el.index === regionIndex)[0],
			dc = region?.dynamics?.all,
            tops;
		if (dc) {
			if (region) {
				tops = region.tops[1]
				if (requestsPartTop === 3) {
					if (dc*requestsPart/100 <= tops["1_3"]) {
						color = "top3";
					}
				}
				if (requestsPartTop === 10) {
					if (dc*requestsPart/100 <= tops["1_10"]) {
						color = "top10";
					}
				}
				if (requestsPartTop === 30) {
					if (dc*requestsPart/100 <= tops["1_10"] + tops["11_30"]) {
						color = "top30";
					}
				}
				if (requestsPartTop === 50) {
					if (dc*requestsPart/100 <= tops["1_10"] + tops["11_30"] + tops["31_50"]) {
						color = "top50";
					}
				}
			}
		}

        return color;
    }

    const getColorByPos = (pos) => {
        let color = "#ffffff"
        if (pos) {
            if (pos < 4) {
                color = "#CEEDFF"
            } else {
                if (pos < 11) {
                    color = "#DDF0CE"
                } else {
                    if (pos < 31) {
                        color = "#FFE2D2"
                    } else {
                        if (pos < 51) {
                            color = "#FFE2D2"
                        } else {
                            color = "#ffc3c3"
                        }
                    }
                }
            }
        }
        return color;
    }

    const getColorByTop = (regionIndex) => {
        let region = regionsSummaryFiltered.filter(el => el.index === regionIndex)[0],
            color = '#ffffff'
        if (region) {
            if (mainTopFilter === 3) {
                if (region.tops[1]['1_3'] > 0) {
                    color = '#CEEDFF'
                }
            }
            if (mainTopFilter === 10) {
                if (region.tops[1]['1_10'] > 0) {
                    color = '#DDF0CE'
                }
            }
            if (mainTopFilter === 30) {
                if (region.tops[1]['1_10'] + region.tops[1]['11_30'] > 0) {
                    color = '#FFE2D2'
                }
            }
            if (mainTopFilter === 50) {
                if (region.tops[1]['1_10'] + region.tops[1]['11_30'] + region.tops[1]['31_50'] > 0) {
                    color = '#FFE2D2'
                }
            }
        }
        return color;
    }

    const getCountByTop = (regionIndex) => {
        let region = regionsSummaryFiltered.filter(el => el.index === regionIndex)[0],
            count = 0
        if (region) {
            if (mainTopFilter === 3) {
                if (region.tops[1]['1_3'] > 0) {
                    count = region.tops[1]['1_3']
                }
            }
            if (mainTopFilter === 10) {
                if (region.tops[1]['1_10'] > 0) {
                    count = region.tops[1]['1_10']
                }
            }
            if (mainTopFilter === 30) {
                if (region.tops[1]['1_10'] + region.tops[1]['11_30'] > 0) {
                    count = region.tops[1]['1_10'] + region.tops[1]['11_30']
                }
            }
            if (mainTopFilter === 50) {
                if (region.tops[1]['1_10'] + region.tops[1]['11_30'] + region.tops[1]['31_50'] > 0) {
                    count = region.tops[1]['1_10'] + region.tops[1]['11_30'] + region.tops[1]['31_50']
                }
            }
        }
        return count ? count : '';
    }

    const renderRegionsByKeyword = () => {
        if (curKeyword.positionsData) {
            let pos = curKeyword.positionsData;
            let resp = []
            regionsSummaryFiltered.forEach(region => {
                if (keywordsStat.existsDates.length > 0) {
                    if (keywordsStat.existsDates.length === 1) {
                        if (pos[keywordsStat.existsDates[0] + ':' + projectId + ':' + region.index]) {
                            resp.push({ ...region, pos: pos[keywordsStat.existsDates[0] + ':' + projectId + ':' + region.index].position })
                        }
                    } else {
                        if (pos[keywordsStat.existsDates[keywordsStat.existsDates.length - 1] + ':' + projectId + ':' + region.index]) {
                            if (pos[keywordsStat.existsDates[keywordsStat.existsDates.length - 2] + ':' + projectId + ':' + region.index]) {
                                resp.push({ ...region,
                                    pos: parseInt(pos[keywordsStat.existsDates[keywordsStat.existsDates.length - 1] + ':' + projectId + ':' + region.index].position),
                                    prePos: parseInt(pos[keywordsStat.existsDates[keywordsStat.existsDates.length - 2] + ':' + projectId + ':' + region.index].position)
                                })
                            } else {
                                resp.push({ ...region, pos: pos[keywordsStat.existsDates[keywordsStat.existsDates.length - 1] + ':' + projectId + ':' + region.index].position })
                            }
                        }
                    }
                }

            })
            return resp;
        }
    }

    const renderRegionsByTop = () => {
        let arr = []
        regionsSummaryFiltered.forEach(el => {
            if (mainTopFilter === 3) {
                if (el.tops[1]['1_3'] > 0) {
                    arr.push({...el, count: el.tops[1]['1_3'] })
                }
            }
            if (mainTopFilter === 10) {
                if (el.tops[1]['1_10'] > 0) {
                    arr.push({...el, count: el.tops[1]['1_10'] })
                }
            }
            if (mainTopFilter === 30) {
                if (el.tops[1]['1_10'] + el.tops[1]['11_30'] > 0) {
                    arr.push({...el, count: el.tops[1]['1_10'] + el.tops[1]['11_30'] })
                }
            }
            if (mainTopFilter === 50) {
                if (el.tops[1]['1_10'] + el.tops[1]['11_30'] + el.tops[1]['31_50'] > 0) {
                    arr.push({...el, count: el.tops[1]['1_10'] + el.tops[1]['11_30'] + el.tops[1]['31_50'] })
                }
            }
        })
        return arr;
    }

    const getColorByVisibility = (vis) => {
    	if (groupIsLoading) {
    		return '#FFFFFF'
		} else {
			if (vis >= 90) {
				return '#CEEDFF'
			} else if (vis >= 70) {
				return '#DDF0CE'
			} else if (vis >= 40) {
				return '#FAF1C2'
			} else if (vis === 0) {
				return '#FFFFFF'
			} else {
				return '#FFE2D2'
			}
		}
	}

    const [markCoords, setMarkCoords] = useState({ x: '0', y: '0', name: '', visibility: false, areaName: '' })

	useEffect(() => {
		if (groupsFilter >= 0) {
			let field = 'g' + groupsFilter + searchSystem,
				fieldRegions = 'g' + groupsFilter + searchSystem + 'regions',
				fieldData = 'g' + groupsFilter + searchSystem + 'data'
			if (groupsForDl[field] && activeRequests < 5) {
				setGroupIsLoading(true)
				if (groupsForDl[fieldRegions] === undefined) {
					setGroupsForDl(st => {
						let obj = {...st}
						obj[fieldRegions] = projectRegions.searchers[searchSystem]?.regions.map(el => el.index) || []
						obj[fieldData] = {}
						return obj
					})
				} else {
					if (groupsForDl[fieldRegions].length > 0) {
						let regionId = groupsForDl[fieldRegions][0]
						setGroupsForDl(st => {
							let obj = {...st}
							obj[fieldRegions] = obj[fieldRegions].filter((el, i) => i !== 0)
							return obj
						})
						setActiveRequests(st => st + 1)
						getGroupSummary({
							region_index: regionId,
						}).then(resp => {
							setActiveRequests(st => st - 1)
							setGroupsForDl(st => {
								let obj = {...st}
								obj[fieldData]['r' + regionId] = resp.result.seriesByProjectsId[projectId].visibility[0]
								return obj
							})
						}).catch(err => message.error(err.message))
					}
				}
			}
			if (activeRequests === 0 && groupsForDl[field] && groupsForDl[fieldRegions]?.length === 0) {
				setGroupsForDl(st => {
					let obj = {...st}
					obj[field] = false
					setGroupIsLoading(false)
					console.log('---group-stat---')
					console.log(obj)
					return obj
				})
			}
		}
	},[groupsFilter, searchSystem, projectRegions, activeRequests, groupsForDl])

	useEffect(() => {
		console.log(selectedDate)
	},[selectedDate])

	return (
        <section className="main map">
			{markCoords.visibility &&
			<div className="map-mark" style={{"top": markCoords.y + 'px', "left": markCoords.x + 'px' }}>
				<div>{markCoords.areaName}</div>
			</div>
			}
            <MapHeader
                setSearchSystem={(val) => {
					setSelectedRegion({ key: -1, index: -1 })
                    setSearchSystem(val)
                }}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                setRequestsPart={setRequestsPart}
                requestsPart={requestsPart}
                setRequestsPartTop={setRequestsPartTop}
                requestsPartTop={requestsPartTop}
                deviceType={deviceType}
				setSelectedDate={setSelectedDate}
				existsDates={existsDates}
                setDeviceType={(val) => {
                	setSelectedRegion({ key: -1, index: -1 })
					setDeviceType(val)
				}}
				selectedDate={selectedDate}
                keywords={keywords}
				setSelectedRegion={setSelectedRegion}
				setSelectedMap={setSelectedMap}
                project={projectRegions}
				keywordsStat={keywordsStat}
                keywordsListIsLoading={keywordsListIsLoading}
                setKeywordFilter={(val) => {
                    setKeywordFilter(val)
                    console.log(keywordsStat)
                    setCurKeyword(keywordsStat.keywords.filter(el => el.id === val)[0])
                }}
                setMainTopFilter={(val) => {
                    setMainTopFilter(val)
                }}
				groupList={groupList}
				groupsListIsLoading={groupsListIsLoading}
				setGroupsFilter={setGroupsFilter}
				groupIsLoading={groupIsLoading}
            />
            {projectsDataIsLoading || (searchSystem === 0 && regionsForDl.length > 0) || (searchSystem === 1 && regionsForDlGoogle.length > 0) ?
                <PageIsLoading/>
                :
                <div id="map" onMouseMove={(e) => {
                	setMarkCoords({...markCoords, x: e.pageX, y: e.pageY, visibility: false })
				}}>
					{selectedMap > 0 ?
						<svg width="1028" height="822" viewBox="0 0 1028 822" fill="none" xmlns="http://www.w3.org/2000/svg">
							{regionsMoscow.map((region, index) =>
								<path data={region.key} className='add' d={region.coords}
									  onMouseMove={(e) => {
										  e.preventDefault()
										  e.stopPropagation()
										  if (region.isSelected) {
											  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
										  } else {
											  setMarkCoords({...markCoords, visibility: false })
										  }
									  }}
									  onClick={() => {
									  	if (region.isSelected) {
											setSelectedRegion({ key: region.key, index: region.index })
										}
									  }}
									  fill={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : region.isSelected ? (
										  selectedFilter === 2 ?  (
											  {
												  top0: "#ffffff",
												  top3: "#CEEDFF",
												  top10: "#DDF0CE",
												  top30: "#FFE2D2",
												  top50: "#FFE2D2",
											  }[getColor(region.index)]
										  ) : selectedFilter === 0 ? (
											  keywordFilter && curKeyword &&
											  getColorByPos(curKeyword.positionsData[lastUpdate + ":" + projectId + ":" + region.index]?.position)
										  ) : selectedFilter === 1 ? (
											  getColorByTop(region.index)
										  ) : selectedFilter === 3 ? (
											  getColorByVisibility(groupsFilter < 0 ? Math.round(regionsSummaryFiltered.filter(r => r.index === region.index)[0]?.visibilities[1]) || 0 :
												  !groupsForDl['g' + groupsFilter + searchSystem] ?
													  groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + region.index] >= 0 ?
														  Math.round(groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + region.index]) : ''
													  : '')
										  ) : "#EEEFF5"
									  ) : "#EEEFF5" }
									  fillOpacity={region.isSelected ? ( selectedFilter === 2 || selectedFilter === 1 || selectedFilter === 0 || region.isActive ? "1" : "0.3" ) : "0.6"}
									  stroke="#8B98EE"
									  strokeWidth="0.324109"
									  key={index}
								/>
							)}
							{selectedFilter === 2 && <>
								{regionsMoscow.map((region, index) => region.x && (region.isSelected ?
										{
											top0: <circle className="add" cx={region.x} cy={region.y} r="3.5" fill="#8B98EE" key={index}
														  onMouseMove={(e) => {
															  e.preventDefault()
															  e.stopPropagation()
															  if (region.isSelected) {
																  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
															  } else {
																  setMarkCoords({...markCoords, visibility: false })
															  }
														  }}
														  onClick={() => {
															  if (region.isSelected) {
																  setSelectedRegion({ key: region.key, index: region.index })
															  }
														  }}
											/>,
											top3: <g key={index}
													 onMouseMove={(e) => {
														 e.preventDefault()
														 e.stopPropagation()
														 if (region.isSelected) {
															 setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														 } else {
															 setMarkCoords({...markCoords, visibility: false })
														 }
													 }}
													 onClick={() => {
														 if (region.isSelected) {
															 setSelectedRegion({ key: region.key, index: region.index })
														 }
													 }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
											top10: <g key={index}
													  onMouseMove={(e) => {
														  e.preventDefault()
														  e.stopPropagation()
														  if (region.isSelected) {
															  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														  } else {
															  setMarkCoords({...markCoords, visibility: false })
														  }
													  }}
													  onClick={() => {
														  if (region.isSelected) {
															  setSelectedRegion({ key: region.key, index: region.index })
														  }
													  }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
											top30: <g key={index}
													  onMouseMove={(e) => {
														  e.preventDefault()
														  e.stopPropagation()
														  if (region.isSelected) {
															  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														  } else {
															  setMarkCoords({...markCoords, visibility: false })
														  }
													  }}
													  onClick={() => {
														  if (region.isSelected) {
															  setSelectedRegion({ key: region.key, index: region.index })
														  }
													  }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
											top50: <g key={index}
													  onMouseMove={(e) => {
														  e.preventDefault()
														  e.stopPropagation()
														  if (region.isSelected) {
															  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														  } else {
															  setMarkCoords({...markCoords, visibility: false })
														  }
													  }}
													  onClick={() => {
														  if (region.isSelected) {
															  setSelectedRegion({ key: region.key, index: region.index })
														  }
													  }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
										}[getColor(region.index)]
										:
										<circle className="add" cx={region.x} cy={region.y} r="3.5" fill="#8B98EE" key={index}/>

								))}
							</>}
							{selectedFilter === 0 && keywordFilter && curKeyword && regionsMoscow.map((el, index) =>
								<text className="region-text" x={el.x ? el.x - 3 : 0 } y={el.y ? el.y + 15 : 0} key={index}
									  onMouseMove={(e) => {
										  e.preventDefault()
										  e.stopPropagation()
										  if (el.isSelected) {
											  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: el.name, visibility: true, areaName: el.areaName })
										  } else {
											  setMarkCoords({...markCoords, visibility: false })
										  }
									  }}
									  onClick={() => {
										  if (el.isSelected) {
											  setSelectedRegion({ key: el.key, index: el.index })
										  }
									  }}
								>
									{curKeyword.positionsData[lastUpdate + ":" + projectId + ":" + el.index]?.position}
								</text>
							)}
							{selectedFilter === 3 && regionsMoscow.map((el, index) => el.isSelected &&
								<text className="region-text" x={el.x ? el.x - 8 : 0 } y={el.y ? el.y + 15 : 0} key={index}
									  onMouseMove={(e) => {
										  e.preventDefault()
										  e.stopPropagation()
										  if (el.isSelected) {
											  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: el.name, visibility: true, areaName: el.areaName })
										  } else {
											  setMarkCoords({...markCoords, visibility: false })
										  }
									  }}
									  onClick={() => {
										  if (el.isSelected) {
											  setSelectedRegion({ key: el.key, index: el.index })
										  }
									  }}>
									{groupsFilter < 0 ? Math.round(regionsSummaryFiltered.filter(r => r.index === el.index)[0]?.visibilities[1]) || '' :
										!groupsForDl['g' + groupsFilter + searchSystem] ?
											Math.round(groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + el.index]) > 0 ?
												Math.round(groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + el.index]) : ''
											: ''
									}
								</text>
							)}
							{selectedFilter === 1 && regionsMoscow.map((el, index) =>
								<text className="region-text" x={el.x ? el.x - 3 : 0 } y={el.y ? el.y + 15 : 0} key={index}
									  onMouseMove={(e) => {
										  e.preventDefault()
										  e.stopPropagation()
										  if (el.isSelected) {
											  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: el.name, visibility: true, areaName: el.areaName })
										  } else {
											  setMarkCoords({...markCoords, visibility: false })
										  }
									  }}
									  onClick={() => {
										  if (el.isSelected) {
											  setSelectedRegion({ key: el.key, index: el.index })
										  }
									  }}
								>
									{getCountByTop(el.index)}
								</text>
							)}
							<path d="M402.862 420.622L402.709 419.556L401.834 413.73L394.485 415.063L395.437 418.337L391.173 419.213L391.858 422.716C391.858 422.716 393.305 422.107 393.876 422.716C394.066 422.906 394.295 423.097 394.561 423.287H394.638L395.666 424.049L397.569 423.744L400.577 423.706H403.28L402.862 420.622Z" fill="#EEEFF5" fillOpacity="0.6"/>
							<path d="M402.709 419.556L402.862 420.622L403.28 423.706H400.577L397.569 423.744L395.666 424.049L394.638 423.287H394.561C394.295 423.097 394.066 422.906 393.876 422.716C393.305 422.107 391.858 422.716 391.858 422.716L391.173 419.213L395.437 418.337L394.485 415.063L401.834 413.73L402.709 419.556ZM402.709 419.556L400.844 418.794" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M579.564 326.62L578.193 326.049L577.279 328.905L581.582 332.903L584.551 327.915L581.696 324.641L579.564 326.62Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M429.324 385.712L425.707 389.291L426.507 391.424L432.446 387.616H434.198L434.731 386.207L430.771 384.418L429.324 385.712Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M305.317 308.42L307.906 304.574L302.956 301.414L300.101 301.985L300.177 302.366C300.824 302.747 301.167 303.127 301.129 303.47V304.612L300.9 305.412C300.862 305.45 300.824 305.488 300.786 305.488L301.205 307.62L305.317 308.42Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M361.057 495.328L360.447 496.889L358.049 497.993L358.62 500.963L360.904 501.458L363.646 501.877L366.044 500.658L366.121 497.993L364.179 495.328H361.057Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M383.976 375.656L382.073 375.085L378.303 374.666L378.456 372.953L382.187 371.354C382.187 371.354 379.407 368.118 378.76 367.889C378.113 367.661 377.161 371.354 377.161 371.354H373.506L372.745 369.488L369.813 368.689C369.813 368.689 369.318 369.336 369.051 369.488C368.785 369.679 366.919 368.536 366.767 368.689C366.615 368.841 362.883 368.46 362.731 368.346C362.617 368.232 362.046 374.286 362.046 374.286L365.282 378.321C365.282 378.321 365.13 379.235 363.835 379.578C363.645 379.616 361.817 378.588 361.817 378.588C361.817 378.588 360.066 379.806 359.952 379.882C359.761 380.073 358.314 379.235 358.314 379.235V380.225L360.18 382.738C360.18 382.738 360.142 385.974 359.99 386.203C359.875 386.469 359.228 388.03 359.228 388.03L358.924 389.858L366.234 390.315V389.249L370.65 388.639L371.64 387.345L370.65 385.517L370.422 383.994L373.125 384.375L372.516 386.469L372.326 388.639L374.61 390.353L378.913 388.106L377.428 386.279L377.961 385.022L377.085 382.129L378.494 380.454C378.494 380.454 379.636 381.063 379.826 381.215C380.017 381.367 380.816 379.959 380.816 379.959L383.519 380.187L383.291 382.586L380.436 385.365L381.197 387.84L383.025 388.145L386.413 380.91L386.185 378.512C386.185 378.512 389.802 376.494 390.068 376.303C390.297 376.113 390.068 375.161 390.068 375.161L383.976 375.656Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M885.87 558.796L882.063 570.752L878.294 584.268L877.151 585.067L875.552 581.945L873.534 579.585L871.935 579.242L869.156 579.318L870.374 581.641L871.25 584.801L866.529 586.057L864.549 586.134L859.751 585.791L856.972 586.248H855.83L853.355 582.707L851.375 580.727L849.776 579.966L848.672 581.07L848.9 576.272L850.233 572.237L853.393 567.896L856.325 568.429L859.485 564.051L860.018 561.119L858.685 558.454L859.142 555.446L861.503 549.278L871.44 550.306L873.687 545.965L875.057 544.823L876.847 544.633L878.865 545.508L880.768 547.603L881.758 550.953L883.776 554.075L886.213 555.217V556.817L885.87 558.796Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M478.248 295.133L477.03 297.379L474.327 295.78C473.908 296.503 473.299 297.037 472.689 297.646L473.908 298.445L475.583 301.567L475.812 302.215L477.601 305.032L475.621 306.403L474.745 308.421L474.631 311.314L475.85 315.198L476.154 319.081L475.05 320.681L475.469 322.242L476.801 324.907L476.916 325.097L481.713 321.632L483.579 320.833L485.711 319.5L483.693 312.152L485.444 311.695L484.569 309.334L488.414 308.459C487.5 302.557 481.751 299.626 478.248 295.133Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M452.661 307.354L455.022 296.313L460.923 296.541L465.53 294.523L468.919 295.856L473.792 298.179L474.287 299.549L475.315 301.034L477.523 305.146L475.62 306.403L474.744 308.42L474.63 311.314L475.848 315.198L476.153 319.081L475.049 320.68L475.467 322.241L476.914 325.059L475.658 326.049L471.774 328.257L469.68 329.171L463.398 330.389L462.256 328.714L460.162 321.213L460.58 320.795L459.781 319.576L459.705 319.233V318.015H460.124V316.797L460.466 316.378V315.959L462.065 317.178L463.665 317.101L463.588 315.959L461.57 312.038L461.913 311.238L464.35 310.781L464.692 309.22L464.997 309.106L465.568 308.306L464.578 308.23L463.703 308.573L462.713 308.497L461.799 308.839L459.933 309.144L458.677 309.03L457.687 308.725L456.925 308.611L456.354 308.078L453.918 308.535L452.661 307.354ZM449.729 304.994L442.153 306.136L437.317 305.908L435.452 306.212L432.444 305.679L430.578 305.984L430.883 307.887L433.586 313.256L439.526 314.246L444.361 314.474L446.265 314.17L447.293 314.969L446.836 317.901L446.036 319.005L442.762 316.644L439.83 316.111L438.231 318.244L439.335 319.043L439.906 322.812L439.373 325.82L438.612 326.924L439.944 329.59L442.762 327.343L445.884 329.666L450.224 333.816L451.024 332.712L451.557 329.78L452.356 328.676L455.593 331.036L457.496 331.836V330.732L456.392 329.932L456.088 328.067L456.887 326.963L454.679 325.363L457.382 324.031L454.603 318.662L455.402 317.558L453.194 315.959L451.633 318.167L451.328 316.264L448.054 313.903L449.653 311.695L448.283 309.03L450.3 307.469L449.729 304.994Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M439.717 637.077C439.564 638.143 439.298 639.057 438.917 639.742L436.671 643.397L434.767 643.93L433.435 643.359L432.559 642.141L431.569 641.836L430.236 642.255L428.98 642.826L427.495 640.808L426.924 641.379L425.02 638.904L423.802 635.554L423.916 628.396L424.563 626.949L428.599 627.178C431.34 627.444 432.787 627.901 432.94 628.548L435.414 635.478L438.194 636.125L439.793 635.668L439.717 637.077Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M476.764 619.789L474.747 627.709L461.916 628.47L459.136 624.587L454.301 624.016L454.529 614.193L461.04 614.116L462.182 608.52L467.855 608.634L469.607 615.297H476.079L476.764 619.789Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M499.455 644.24L507.413 641.918L510.992 646.753L506.537 653.873L501.549 654.178L496.828 651.855L491.917 652.617L490.889 648.01L492.983 644.088L496.866 644.507L499.455 644.24Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M708.444 565.496L710.538 566.828L711.528 568.085L712.099 570.102L712.67 570.788L719.79 569.036L723.369 574.824L717.772 577.184L713.165 580.192C710.538 582.438 708.786 583.543 707.911 583.543C707.34 583.543 705.893 582.286 703.57 579.735L700.296 575.852L698.278 577.87L697.288 580.002L696.717 582.477L684.686 566.6L688.036 563.44L686.018 555.939L690.587 554.34H693.519L695.499 557.5L696.374 558.642L697.516 558.985L699.725 558.794L701.476 559.48L708.444 565.496Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M867.441 392.526L870.335 383.693H874.485L877.074 377.525L883.661 376.992L884.993 378.363L885.793 378.591L887.011 378.363L888.23 377.944L889.981 389.481L879.968 398.542L871.706 393.859L867.441 392.526Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M554.815 305.531L552.15 303.627L548.686 302.751L549.028 299.325L550.78 294.642L554.93 291.824L560.983 296.165L561.669 300.201V304.769L560.869 307.358L554.815 305.531Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M539.434 356.015L539.548 357.385L539.243 371.473L539.814 371.054L543.393 370.254L545.297 369.569L546.173 371.016H547.201C546.782 366.028 546.744 360.926 546.706 355.977H539.434V356.015Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M542.441 419.869L546.211 415.719L551.427 416.29L553.445 419.298L553.902 423.067L559.384 426.722L557.938 429.997L553.331 429.311L551.465 428.207L544.954 423.105L542.936 421.201L542.441 419.869Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M610.784 463.534L616.61 467.417L618.285 470.653L619.313 472.214C619.77 473.357 619.618 474.194 618.856 474.689C618.095 475.222 615.049 476.174 609.794 477.507L606.139 474.613L605.149 468.331L607.015 461.668L610.784 463.534Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M429.78 54.5417L433.245 53.7422L433.778 53.9706L431.874 59.1868L431.95 62.7657L435.605 67.4489V67.5631L435.72 68.9337L435.187 69.3906L433.092 70.5329L432.331 72.7411L431.76 76.1678L429.666 76.6247L427.001 78.6426L425.744 80.0895L424.373 80.889L422.812 81.1936L421.251 82.0693L418.358 80.0514L413.027 71.4466L407.354 66.7254L404.994 65.1644L403.775 64.0222L409.677 61.5474L408.877 59.1868L413.599 58.3111L420.718 55.8363L422.736 58.6157L427.876 58.5014L428.866 56.0647L429.78 54.5417Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M479.695 281.849L478.591 277.395L476.345 278.499L474.327 280.25L472.195 282.573L471.852 283.677L468.54 283.791L464.275 280.669L464.58 282.535L460.582 287.979L462.714 289.578L461.953 290.682L462.257 292.548L465.532 294.528L469.339 296.127L472.69 297.764C473.299 297.155 473.908 296.584 474.327 295.899L477.03 297.498L480.952 290.264L480.533 285.542L480.266 284.514C481.751 284.134 483.122 283.791 483.122 283.258C484.416 279.679 482.056 280.897 479.695 281.849Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M550.286 321.554L549.524 317.557L548.648 315.12L548.458 313.521L552.037 311.046L553.37 309.18L554.436 306.325C550.895 305.601 547.278 305.601 543.775 305.145L539.396 308.838V309.218C536.617 310.475 533.457 310.056 530.487 310.665L530.563 310.856L528.127 314.13L526.87 318.166L527.632 322.087L529.497 321.783L531.477 322.811L535.284 322.621L536.389 323.382L536.693 325.286L534.599 330.426L530.792 330.997L530.03 332.101L529.345 332.672L531.134 334.119L533.838 335.185L537.074 334.462L539.13 332.672C540.348 333.243 541.947 334.005 543.166 334.576L543.737 333.814L545.641 331.263L546.973 328.75L551.999 328.636L554.093 322.126L553.788 320.222L550.286 321.554Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M635.532 225.079L634.314 223.518L632.715 221.957L631.344 220.739L629.898 220.282L629.974 219.863L629.06 214.266V213.847L628.527 212.934L627.423 211.068L627.575 210.078L624.605 212.667L601.228 232.999L599.971 234.712L595.707 238.253L594.565 238.862L590.415 242.479L582.571 249.294L581.353 248.381L579.868 249.294L580.325 250.589L577.85 252.645L577.393 252.302L577.469 250.399L577.203 249.066L576.137 249.294L576.784 252.264L575.337 253.673L576.061 255.462L577.089 256.148L578.954 256.072L579.83 257.023C579.83 257.023 580.401 258.623 580.401 258.737C580.401 258.775 580.249 259.232 580.135 259.651L577.127 258.927L576.099 260.945L576.784 261.745L575.071 260.679L573.434 259.384L570.654 262.582L570.502 263.382C570.502 263.382 571.949 264.143 571.987 264.143C572.025 264.143 571.835 264.943 571.835 264.943L573.053 266.009L574.462 266.885L575.337 266.314L575.947 266.694L578.612 265.171V267.303V268.636L579.716 269.931L581.125 271.225L582.686 270.768L583.295 272.291L584.513 271.339L584.056 270.464L584.97 268.865L585.579 269.321L585.846 269.512L586.874 268.217L589.006 267.989L590.834 265.514L591.443 264.676L592.775 262.887L602.903 253.635L608.119 250.399L608.462 250.094V248.495L609.68 247.467L635.761 225.422L635.532 225.079Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M578.423 308.157L575.948 305.111L578.27 304.464V304.045L573.663 301.189L570.579 300.352L570.313 302.75L568.904 303.664V303.74L568.752 303.778L565.744 302.941L565.211 303.131L568.942 308.766L570.77 310.06L571.265 310.784L572.026 311.05L572.179 313.221L574.806 311.964L576.633 311.812L578.423 308.157Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M597.609 295.016L596.581 297.49L592.126 298.29L591.06 300.727L589.652 304.268H582.608L581.428 312.301L578.915 313.9L576.668 316.87L576.478 318.66L574.917 320.411L575.907 321.934L575.64 325.132L575.755 326.617L575.983 327.226L577.887 326.998L578.191 326.046L579.562 326.617L581.694 324.637L584.55 327.912L584.321 328.292L587.748 329.739L587.634 330.196L589.119 331.871L587.748 331.681L586.872 334.613L592.964 335.26L593.078 334.613L595.439 334.955L599.856 336.859L599.817 335.374L601.531 331.11L605.49 330.919V327.874L602.14 325.437L602.292 322.429L600.084 320.068L599.399 315.195L597.571 311.844L601.417 309.103L601.302 300.879L603.32 300.613L602.901 295.929L601.912 295.016H597.609Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M539.168 401.053L539.967 401.967L540.881 403.946L542.213 403.642L545.259 404.594C545.259 404.594 547.506 404.594 547.582 404.556C547.658 404.518 549.562 405.089 549.562 405.089L548.762 399.796L548.229 398.768L538.292 391.801V400.444L537.683 401.433L538.673 401.395L539.168 401.053Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M542.557 407.642C542.176 407.642 541.795 408.403 541.414 408.403C541.719 406.842 542.823 405.509 543.394 404.024L542.214 403.644L540.881 403.948L539.967 401.968L539.168 401.055L538.635 401.359L537.645 401.397L536.122 403.872L529.764 410.459L529.954 410.764L530.944 412.134L532.619 412.02L534.523 409.583L536.084 408.708L537.873 410.04L539.13 410.726L541.338 412.325L541.224 413.238L540.539 414.266L540.12 414.685L540.196 415.256L540.881 416.056L541.338 417.046C542.747 414 544.194 411.259 542.557 407.642Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M545.143 404.671C545.143 404.671 547.39 404.633 547.466 404.633C547.542 404.633 549.446 405.166 549.446 405.166L548.646 399.874L548.113 398.846L538.176 391.879V390.279L541.222 391.879L541.031 389.746L538.023 387.157V385.406L538.252 385.063L538.671 383.921L539.775 383.464L541.564 386.624L541.983 385.406L543.544 383.807L548.265 382.55H550.245L551.806 379.733L553.786 378.515L554.357 378.629L556.261 378.324L559.802 382.588L561.667 382.284L565.208 379.847L566.693 383.845L570.501 383.312L573.851 386.206L574.156 388.109L576.364 389.67L578.458 392.374L573.737 396.752L571.947 397.514L571.148 398.542L572.176 401.207L570.424 403.529L568.445 405.319L563.952 402.654L561.287 401.854L559.916 402.844L559.688 404.329L562.734 409.431L561.477 412.248L559.116 415.485L560.221 416.284L561.363 423.861L560.944 425.079L560.868 427.059L558.507 430.105L557.86 429.991L559.307 426.754L553.824 423.099L553.367 419.33L551.349 416.322L546.133 415.751L542.364 419.901L542.821 421.234L544.839 423.137L543.735 422.338L542.059 420.548L541.298 417.388L541.222 417.198C542.63 414.076 544.077 411.334 542.44 407.717C542.059 407.717 541.679 408.479 541.298 408.479C541.602 406.918 542.707 405.585 543.278 404.1L545.143 404.671ZM545.143 404.671L545.41 404.748M557.936 389.899L554.281 390.089L552.035 390.432L550.474 387.767L554.243 385.673L556.223 386.32L557.327 386.548L557.555 388.3L557.974 389.518V389.899H557.936Z" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M601.381 434.672L598.182 430.522L599.02 429.494L597.649 428.618L597.345 428.809L596.964 427.247L596.279 425.725L596.964 422.717L594.413 419.861L592.357 417.082C592.357 417.082 592.053 414.036 592.014 413.769C591.976 413.503 588.626 411.028 588.626 411.028L583.714 409.848L581.506 410L579.45 410.228L578.308 411.675L578.803 413.769L578.27 414.302L578.232 415.978C577.394 416.967 576.176 418.376 576.061 418.338C575.909 418.3 574.767 418.414 574.767 418.414L572.901 417.995L572.749 419.062L574.348 421.689L575.3 423.669L574.615 425.877L576.1 427.4L578.727 425.991L582.153 429.265L585.161 430.217L586.646 430.598L589.159 429.837L589.768 431.017L591.101 432.464L593.119 433.454L594.147 434.215L596.203 434.063L599.363 436.5L601.381 434.672Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M705.475 324.373L703.837 321.975L702.276 320.68L701.02 319.119L697.136 318.053L696.603 316.682L685.752 316.188L685.372 333.054L683.658 334.12L683.734 335.339L684.572 335.719V338.613L698.507 337.09V337.014H699.383L706.008 337.166L704.865 334.653L703.799 332.255L706.008 331.798L706.465 326.353L706.655 326.125L705.475 324.373Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M444.666 530.318L445.199 530.737M514.494 582.67L512.057 579.777L511.753 577.873L517.464 575.855L518.682 572.961L518.911 568.126L517.236 563.557L516.931 561.653L518.53 559.521L516.322 557.922L512.096 557.161H503.148L503.034 552.82L501.549 551.488L501.739 549.812L503.605 549.508L504.366 548.746L506.384 547.185V543.263L505.699 538.314L513.2 537.172L512.324 531.575L508.288 530.242L506.917 527.577L508.25 523.465L509.012 522.361L511.715 521.028L512.514 519.924L510.04 516.459L510.268 511.624L506.004 515.165L505.433 511.396L508.098 510.025L507.793 508.159L508.593 507.055L505.356 504.618L505.052 502.753L503.948 501.953L502.044 502.258L500.788 506.294L500.255 509.301L498.655 511.434L495.191 513.908L493.325 514.213L492.221 513.413L490.317 513.718L488.642 516.383L486.624 515.698L487.081 511.357L482.74 508.121L481.141 510.329L472.308 515.546L468.539 516.117L468.006 519.125L463.17 518.896L463.741 522.665L461.838 522.97L457.269 524.645L453.5 525.216L450.834 526.549L451.139 528.453L447.674 530.242L446.075 529.9L444.971 528.186L444.248 528.224L443.753 524.341L442.268 522.818L441.963 519.962L439.222 519.353V522.132L437.09 522.589L436.024 522.323L436.252 521.561L433.092 519.581L431.759 519.696L430.579 521.295L430.998 524.15L431.379 523.427L430.236 527.12L428.218 530.356L425.287 529.557L421.517 529.9L421.213 530.928L424.106 532.945L423.459 538.39L419.195 540.141L420.337 547.642L418.433 547.947L416.872 550.155L417.9 550.916L410.4 552.059L409.6 553.163L402.671 554.267L401.985 555.6L403.242 562.186L404.841 564.166L407.201 562.148L409.067 563.29L408.839 564.433L409.029 564.661L409.676 565.004L410.666 566.374L411.694 567.745L412.836 567.936H413.864C413.979 567.936 414.055 568.126 414.055 568.507C414.055 568.964 413.979 569.382 413.864 569.725L413.103 571.286C412.684 571.971 412.532 572.581 412.684 573.076L413.56 574.675L414.359 575.665C414.512 575.741 414.512 575.931 414.359 576.236L413.941 577.035L413.75 577.606L413.941 578.177L414.131 578.482L414.474 578.71L415.92 579.015H418.243L420.794 579.662L423.269 579.738L425.934 580.766L428.409 580.843L429.513 582.518L431.531 583.394L432.292 583.85L433.435 584.307L434.31 584.193L435.452 583.165L436.709 580.272L436.823 577.911L438.689 577.606L440.669 581.3L444.095 581.185L444.552 583.622L445.58 584.193L451.253 584.307L452.053 583.622L451.977 581.49L457.916 579.891L460.239 582.099L466.026 579.32L469.795 578.672L471.471 582.137L473.679 581.147L474.478 579.815L478.362 580.233L482.702 583.47L480.837 590.475L482.207 593.179L483.312 593.94L483.616 595.844L485.482 595.539L487.919 592.303L490.051 590.932L488.375 597.824L490.964 599.575L492.83 599.27L496.295 596.796L495.99 594.93L494.962 594.13L495.724 593.026L495.419 591.161L497.627 592.722L500.293 591.351L505.128 591.58L508.935 591.008L509.24 592.912L510.573 595.577L512.476 595.273L515.408 595.806L514.837 592.036L514.951 589.257L519.215 589.676L520.015 589.562L520.7 588.99L521.5 587.962L522.147 582.632L514.494 582.67ZM435.681 523.541L434.653 522.742L435.681 523.503L436.29 526.625H436.252L435.681 523.541Z" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M388.431 518.591L388.127 518.743L387.251 519.885L387.137 519.999L386.604 521.713L385.461 525.863L384.433 527.081C383.862 526.815 383.253 526.51 382.644 526.206L381.502 528.223L378.342 527.081L375.22 529.099L371.222 527.995L370.08 529.556L371.679 531.536L366.957 535.991L365.815 538.351L363.493 539.608L361.056 538.047L359.838 535.686L360.523 531.308L359.99 524.188L353.974 517.943H351.614L346.055 518.477L343.618 517.715L338.059 515.393L335.622 515.05L330.14 517.867L328.16 517.525L323.705 513.26L324.848 512.042L327.97 508.006L328.312 506.026L327.513 502.866L327.855 499.706L327.056 498.145L324.962 495.023L321.383 493.881H320.964L317.842 496.317L315.519 498.754L313.654 506.712L312.093 509.072L310.494 508.311L308.476 506.331L304.897 505.988L300.632 509.263L297.815 508.501H296.254L294.274 509.301L293.056 506.94L292.256 505.798L290.695 507.016L289.134 509.453L288.373 512.613V513.755L286.393 512.994L285.174 513.793L286.393 515.773L287.611 516.916L287.687 518.933L284.565 522.17L282.585 525.33L281.024 526.129L279.121 529.708L278.702 531.308L275.998 532.907L272.534 539.722L265.033 540.636L255.02 538.389L252.316 539.265L248.395 542.844L246.834 544.862L245.273 544.938L242.798 541.016V539.417L238.343 534.315L236.363 533.973L235.906 532.374L229.548 528.909L228.33 528.985L226.007 531.764L225.208 532.221L225.284 532.754L225.208 533.782L224.065 535.001L223.304 536.981L219.42 537.437H219.306L218.887 536.676L218.088 534.696L219.192 530.013L218.849 529.442L217.631 528.757L216.831 527.957L215.613 527.614L214.813 526.053L213.595 525.254H213.176L212.415 525.673L211.196 526.891L210.054 526.548L208.836 525.749L208.036 526.168L207.237 525.025L206.475 525.444L204.457 523.883L204.572 523.198L202.325 514.821L202.021 512.956L200.993 512.156L200.193 513.26L199.089 512.461L199.622 509.453L200.421 508.425L199.051 505.722L200.536 505.798L201.982 506.255L202.516 503.323L203.848 499.287L205.714 498.983L206.513 497.878L212.453 498.868L215.118 497.536L215.918 496.432L217.022 497.231L218.887 496.927L219.458 500.696L219.04 501.914L219.725 502.562L223.532 501.99L226.198 500.62L228.101 500.315L229.662 498.183L229.891 493.348L233.698 489.312L235.602 489.007L237.734 490.568L238.077 491.025L239.105 491.787L239.904 490.682L239.6 488.817L239.295 488.398L233.85 484.4L231.947 484.705L231.414 487.637L229.548 487.941L228.444 487.142L228.139 485.276L229.167 479.336L234.764 478.461L235.564 477.357L234.688 475.224L235.45 474.12L238.153 472.75L240.018 472.445L240.818 471.341L240.513 469.475L246.186 467.229L248.052 466.924L250.26 469.856L253.497 472.293L252.735 473.321L253.04 475.224L254.905 474.92L255.705 473.816L255.4 471.95L257 469.742L259.132 471.341L261.606 474.806L263.472 474.501L263.777 476.367L265.985 477.966L270.325 477.28L270.554 476.29L273.219 474.92L276.76 472.483L278.093 475.148L280.301 476.747L285.136 476.976L286.735 474.768L289.401 473.397L290.2 472.293L288.829 469.628L291.495 468.257L295.302 467.686L297.434 469.285L299.338 468.98L300.899 466.772L300.594 464.906L301.394 463.802L304.402 464.335L305.163 463.231L304.859 461.327L303.831 460.566L301.356 457.025L299.452 455.35L300.328 453.218L301.813 450.743L301.927 448.078L301.698 445.07L304.973 442.976L307.676 440.539L308.894 437.607L310.494 435.399L311.522 434.942L313.844 435.132L314.073 436.122L313.501 437.455L312.473 441.833L313.578 442.633L313.882 444.537L316.09 446.098L317.08 447.697L317.385 449.562L319.593 451.162L320.393 450.057L320.088 448.192L320.202 444.499L322.525 444.803L324.429 443.813L325.533 444.613L326.294 444.689L327.398 444.346L329.607 445.945L329.074 448.877L330.977 448.573L331.434 445.641L332.234 444.537L336.003 443.966L338.478 447.43L340.686 449.029L340.877 444.194L345.446 442.519L346.245 441.415L348.453 443.014L349.253 441.91L351.119 441.605L351.918 440.501L353.022 441.3L355.688 439.93L357.591 439.625L361.589 434.181L361.018 430.411L363.378 427.175L365.282 426.87L368.214 427.403L374.991 427.289L374.686 425.423L375.486 424.319L378.418 424.852L385.918 423.71L388.622 422.339L392.657 423.672L394.485 423.406C395.018 423.786 395.589 424.129 395.589 424.129L397.493 423.824L400.501 423.786H403.204L402.823 420.664L402.671 419.598L403.699 420.017L409.296 419.141L412.761 418.113C413.103 418.799 413.446 419.484 413.865 420.093V420.169L413.408 420.893L415.273 425.766L417.52 427.479L418.319 431.858L416.987 432.772L416.949 435.513L418.472 436.084L418.548 437.493L417.596 437.912L417.901 443.394L420.985 443.356L420.337 447.354L418.814 447.925V450.134L420.49 452.19L420.223 454.322L415.54 455.388L412.951 455.236L413.141 457.025L420.794 463.307L419.995 464.411L419.423 465.173L416.72 465.059H416.644L416.53 462.508L415.312 462.279L412.684 464.526L412.418 463.269L411.161 462.089L411.085 461.251L408.306 460.414L408.154 458.243L404.308 457.672V459.462L402.138 459.995L401.605 463.307L398.902 462.279L399.435 461.023L397.569 459.881L396.922 458.891L395.589 459.157L395.208 459.766L394.028 459.728L395.132 448.953L388.279 447.811L388.888 442.861L385.728 442.062V445.26L369.28 443.928L368.747 455.959H366.577L366.234 463.117L368.328 464.754L369.318 468.409L371.717 469.247L370.993 471.15L375.334 475.491L373.658 477.357L375.296 479.984L374.763 481.583L382.111 488.665L383.71 489.007L387.289 493.766L388.165 495.861L390.525 498.488L391.173 497.802L392.696 499.325L390.449 502.371L390.221 507.207L391.896 509.453L393.381 509.263L393.571 507.473L395.818 507.702L395.551 511.319L395.17 516.078L393.038 517.22L389.459 518.134L388.431 518.591ZM388.431 518.591L387.708 518.134M366.12 497.993L366.044 500.658L363.645 501.876L360.904 501.457L358.619 500.962L358.048 497.993L360.447 496.927L361.056 495.366H364.178L366.12 497.993Z" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M653.312 375.927L654.112 374.823L653.084 371.549L650.495 369.226L650.152 369.112L648.591 367.246L648.4 366.447L652.665 363.629V363.515L648.096 366.637L652.703 363.477L652.931 357.537L652.741 357.347L653.16 355.557L652.398 353.996L649.314 351.217H647.487L647.639 351.484L647.334 350.912L647.639 348.894L644.669 345.582H641.585C641.585 345.582 635.798 346.267 635.684 346.496C635.57 346.724 627.764 356.205 627.764 356.205L627.726 359.746L627.307 361.954C627.307 361.954 627.574 364.505 627.726 364.657C627.879 364.809 626.736 366.104 626.736 366.104L628.374 366.827L631.876 368.198L631.991 369.15L632.219 371.054L633.171 374.785L632.79 379.278L632.105 383.999L632.333 383.961L638.806 388.758L645.05 391.652L644.479 387.882L645.012 384.874L647.373 381.638L651.18 381.067L649.809 378.402L650.609 377.298L653.312 375.927Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M643.034 270.16L637.932 265.477L635.61 267.076L631.841 268.218L631.917 270.236L635.8 270.54V273.015L631.193 274.995L628.719 273.32L624.454 273.129L624.683 275.452L626.13 275.642L626.701 277.508L630.47 277.394L630.927 281.277L627.348 281.848L624.683 279.945L620.076 283.181L614.631 280.706L610.824 280.402L607.054 279.145L606.179 283.866L609.72 286.075L613.413 286.76L613.299 288.321L613.07 289.349L613.146 289.577L613.565 292.471L611.661 294.299L615.05 296.202L616.725 294.908L620.647 295.365L625.52 296.012L626.434 292.623L634.506 292.928V290.72H635.61L635.762 281.925L634.087 281.353L635.762 277.127L636.371 275.49L638.504 275.947L641.74 273.815L641.169 273.32L643.034 270.16Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M588.434 380.116L584.399 378.783L581.124 376.423L577.888 375.09L578.116 373.529L580.02 373.453L588.511 376.118L589.386 372.577L582.99 369.341L581.733 364.886L582.495 361.954L579.944 362.145L575.108 361.916L574.233 361.383L574.157 353.312L575.299 344.136L571.529 344.364L567.532 338.653L563.839 338.12L560.374 339.453L557.023 338.691L555.424 335.988L555.348 334.122L554.015 332.561L551.807 330.772L552.036 328.754L547.01 328.868L536.616 343.717L535.511 342.917L534.864 343.793L534.56 344.098L534.75 344.288L537.872 348.438L539.547 357.462L539.433 356.091H546.743C546.743 361.041 546.819 366.105 547.238 371.13H546.286L546.705 374.291L543.926 373.529H541.489L541.565 377.108L542.441 379.088L543.583 379.887L544.002 378.669L544.421 379.088L544.84 379.012V378.25L545.982 377.831L548.761 376.156L549.903 375.737L552.683 376.08L552.759 376.88L553.178 378.022L553.977 378.441L554.548 378.555L556.452 378.25L557.138 379.126L559.955 382.553L561.821 382.248L565.362 379.811L566.846 383.809L570.654 383.276L574.004 386.17L575.603 384.037L580.934 381.258L582.038 382.058L586.074 383.314L587.978 383.009L589.577 380.877L588.434 380.116ZM544.002 350.532L540.004 352.512L538.215 346.573L542.936 344.593L543.355 344.174L544.345 350.19L544.002 350.532Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M544.348 350.156L544.005 350.499L540.007 352.479L538.218 346.539L542.939 344.559L543.358 344.141L544.348 350.156Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M557.52 388.308L557.939 389.526V389.945L554.284 390.135L552.038 390.478L550.477 387.813L554.246 385.719L556.226 386.366L557.33 386.594L557.52 388.308Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M423.118 413.211L425.136 410.66L428.068 409.441L429.286 410.431L429.705 411.459L429.895 412.564C429.895 412.982 429.515 413.401 428.791 413.82C428.487 414.01 427.954 414.239 427.192 414.505L425.593 414.848H424.679L423.651 414.62C423.385 414.505 423.232 414.315 423.232 414.086L423.118 413.211Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M440.899 300.279C440.1 298.908 438.691 297.956 437.13 297.233L437.282 296.967L437.853 294.949L435.531 293.959L432.98 291.979L429.21 288.057L426.659 287.943L418.055 286.801L414.895 287.715L418.474 293.616L419.844 293.73L417.027 297.195L419.578 304.124L428.297 307.589L430.771 302.335L431.304 300.888L432.066 301.117L433.094 301.193L434.198 301.65L434.731 300.964L434.769 300.926C436.292 301.764 437.777 302.487 438.995 303.706C439.757 302.563 441.661 301.04 440.899 300.279Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M411.429 379.892L410.63 379.245L410.287 378.255L409.031 377.227L407.774 377.912L407.432 378.826L408.383 379.359L409.792 379.473L410.097 379.778L409.335 381.301L408.003 382.747L407.317 383.356L408.498 384.499L410.858 383.356L412.077 382.519L413.485 382.443L412.381 380.691L411.429 379.892Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M405.681 380.54L405.301 379.474L403.473 378.408L402.864 376.733L402.141 376.048L400.694 375.477L400.123 375.819L399.475 376.847L397.991 377.342L396.125 377.418L395.401 376.733H393.688L392.546 377.228V377.837L395.592 379.284L396.696 378.561L397.267 379.094L398.866 379.284L399.247 380.883L397.8 381.188C397.8 381.188 397.343 382.863 397.267 383.015C397.191 383.168 399.133 383.244 399.133 383.244L400.085 382.977L400.96 382.063V380.464L401.569 380.426L401.722 381.721L404.273 382.482L405.11 383.32L405.796 383.701L406.519 383.662L406.671 382.482V381.949L405.491 381.873L405.681 380.54Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M390.032 376.506L386.682 378.258V378.943L389.88 378.41L391.631 377.915L391.974 375.098L391.022 374.945L390.032 376.506Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M459.137 346.007L458.338 346.882L457.348 350.537L456.129 352.517L451.979 354.878L451.865 356.743L452.893 357.543L453.35 359.104L451.218 361.541C451.751 363.102 452.208 364.625 451.941 366.186C452.855 366.186 453.769 366.186 454.644 366.186L454.568 367.518L455.939 374.638L457.804 378.788L458.68 381.53C454.682 383.281 451.713 386.555 454.225 391.277C455.368 388.307 457.995 387.279 460.66 386.175L460.698 386.251L462.944 389.678L463.82 391.695L461.688 393.447L460.546 394.589L462.564 397.368L460.203 397.787L459.784 396.645H458.185L457.843 397.863L455.482 397.94L454.682 398.739H453.54L449.314 401.633L448.286 399.006L445.05 401.48L442.841 402.623L438.577 403.536L436.902 405.212L435.036 407.687L434.808 408.905V409.019L426.622 410.047L423.614 411.189L421.253 414.464L417.484 415.035L416.57 416.025L415.123 417.167L413.677 417.852L412.877 418.081C413.22 418.766 413.562 419.451 413.981 420.061V420.137L413.524 420.86L415.39 425.734L417.636 427.447L418.436 431.826L417.103 432.739L417.065 435.481L418.588 436.052L418.664 437.46L417.712 437.879L418.017 443.362L421.101 443.324L420.454 447.322L418.931 447.893V450.101L420.606 452.157L420.34 454.289L415.656 455.355L413.067 455.203V456.612L420.72 462.894L419.35 464.76L416.57 464.645L416.456 462.094L415.238 461.866L412.611 464.112L412.344 462.856L411.088 461.676L411.011 460.838L408.232 460L408.08 457.83L404.234 457.259V459.048L402.064 459.582L401.531 462.894L398.828 461.866L399.361 460.609L397.495 459.467L396.848 458.477L395.515 458.744L395.135 459.353L393.954 459.315L395.058 448.54L388.205 447.398L388.814 442.448L385.654 441.649V444.847L369.206 443.514L368.673 455.546H366.503L366.16 462.704L368.254 464.341L369.244 467.996L371.643 468.833L370.919 470.737L375.26 475.078L373.585 476.943L375.222 479.57L374.689 481.169L382.037 488.251L383.636 488.594L387.215 493.353L388.091 495.447L390.451 498.074L391.099 497.389L392.622 498.912L390.375 501.958L390.147 506.793L391.936 509.04L393.269 508.964L393.497 507.174L395.744 507.288L394.982 515.741L392.964 516.731L388.928 517.835L388.015 518.406L387.101 519.624L385.426 525.45L384.398 526.668L384.588 526.782L384.664 528.153L387.9 532.417L389.157 537.976L391.251 541.098L392.051 543.078L394.03 541.86L396.391 542.202L398.828 544.982L398.904 547.342L397.343 549.779L400.579 554.043L402.178 555.376L402.864 554.043L409.793 552.939L410.593 551.835L418.093 550.693L417.065 549.931L418.626 547.723L420.53 547.418L419.388 539.918L423.728 538.166L424.261 532.722L421.329 530.628L421.748 529.638L425.518 529.295L428.564 530.095L430.543 526.668L431.229 523.889L430.81 521.033L431.99 519.434L433.323 519.32L436.483 521.3L436.255 522.061L437.321 522.328L439.453 521.871V519.091L442.194 519.7L442.499 522.556L443.984 524.079L444.479 527.963L445.202 527.924L446.306 529.638L447.905 529.98L451.256 528.229L451.37 528.153L451.103 526.287L453.769 524.955L457.538 524.384L460.965 523.127L461.65 522.746L462.259 519.244L464.087 508.887L464.924 507.859L464.049 506.336L462.868 505.88L462.259 504.547L460.736 503.976L460.47 502.758L460.736 500.625L462.868 501.958L464.582 501.577L466.638 501.158L467.399 499.179L465.952 495.942L463.592 494.495L466.523 492.135L466.561 490.383L470.331 489.355L467.323 486.386L469.493 483.378L472.082 482.54L473.415 484.977L474.481 483.682L474.176 482.198L474.862 481.055L474.062 478.657L474.557 477.096L474.481 475.496L471.473 472.641L471.892 470.928L469.417 470.585L468.884 467.615L466.98 466.663L465.914 466.549L460.736 465.445L462.259 463.16L458.985 462.361L461.574 459.467L462.069 457.221C462.069 457.221 463.896 457.982 464.011 457.982C464.125 457.982 465.115 457.373 465.115 457.373L467.628 456.231L469.341 454.289L470.635 454.442L472.615 456.574L473.948 458.553L478.25 459.239L478.403 461.028L477.184 461.98L478.555 463.884L480.953 465.255L481.981 465.293L483.086 464.531C483.733 463.313 484.076 462.132 484.076 460.99C484.076 460.115 484.532 458.972 485.408 457.564C486.322 456.117 487.121 455.355 487.769 455.355L488.606 455.393L490.777 454.403L491.195 452.386L492.68 452.995L494.051 450.253L497.363 452.652L499.534 451.015L499.191 445.761C499.191 445.761 497.211 445.38 497.135 445.38C497.097 445.38 496.412 443.514 496.412 443.514L494.356 442.22L494.736 440.506L493.899 440.621L492.871 440.202L493.556 434.643V433.843L493.899 431.064V430.645L494.241 428.627L496.602 426.267L496.259 425.124L510.118 425.315L513.393 424.401L523.444 416.444L536.389 403.689L538.521 400.224V389.982L541.567 391.581L541.377 389.449L538.369 386.86V385.109L538.598 384.766L539.016 383.624L540.121 383.167L541.91 386.327L542.329 385.109L543.89 383.509L548.611 382.253H550.591L552.152 379.436L554.132 378.217L553.332 377.798L552.913 376.656L552.837 375.857L550.058 375.514L548.916 375.933L546.136 377.608L544.994 378.027V378.788L544.575 378.864L544.156 378.446L543.738 379.664L542.595 378.864L541.72 376.885L541.644 373.306H544.08L546.86 374.067L546.403 370.488L545.184 369.346L543.623 370.146L541.605 370.488L540.044 370.945L539.283 371.745L539.511 369.955L539.74 357.238L538.065 348.215L533.838 342.77L516.857 327.236L513.507 324.685L510.271 323.695L505.664 323.352L498.049 321.487L494.508 320.002L492.147 319.545L489.33 319.735L489.216 314.367L491.081 312.387V310.179L492.833 309.417V307.438L484.799 309.303L485.675 311.664L482.857 312.311L484.989 317.223L483.847 320.802L481.981 321.601L475.928 326.056L472.044 328.264L469.95 329.178L463.668 330.396L462.526 328.721L460.432 321.22L460.85 320.802L460.051 319.583L459.975 319.24V318.022H460.393V316.804L460.736 316.385V315.966L462.335 317.184L463.934 317.108L463.858 315.966L461.84 312.044L462.183 311.245L464.62 310.788L464.962 309.227L465.267 308.999L465.8 308.313L464.772 307.552L464.011 308.542L462.906 307.78L462.107 308.808L460.203 309.113L457.995 307.628L457.309 308.618L456.662 308.161L454.225 308.618L452.664 307.476L451.446 308.275L450.647 307.476L448.629 309.265L449.961 311.702L448.476 313.834L451.713 316.309L452.131 317.87L453.616 316.537L454.035 316.956L455.634 318.098L454.835 319.317L458.109 324.419L455.748 325.066L455.063 325.408L457.195 327.008L456.396 327.921L456.738 330.054L457.843 330.739L457.728 331.729L458.261 332.262L459.594 332.604L460.622 332.719L461.041 334.28L461.117 336.26L460.774 338.696L458.794 340.295L457.576 339.877V339.077L457.157 338.734V337.516L457.843 334.737L454.72 334.813L454.302 335.612H451.522L451.941 336.412L451.141 337.211L451.218 340.372L450.456 341.171V341.933H452.817L453.274 343.494L451.256 343.57L450.913 345.93L452.512 349.052L453.312 348.253L452.512 347.111L453.274 346.692L454.53 348.672H454.873V348.253L455.672 347.453V346.654H456.015L458.376 345.854H459.175L459.404 345.74" stroke="#8B98EE" strokeWidth="0.324109"/>
							<path d="M557.52 388.308L557.939 389.526V389.945L554.284 390.135L552.038 390.478L550.477 387.813L554.246 385.719L556.226 386.366L557.33 386.594L557.52 388.308Z" fill="#EEEFF5" fillOpacity="0.6" stroke="#8B98EE" strokeWidth="0.324109"/>
							<defs>
								<filter id="filter0_d_3282_7405" x="369" y="318" width="233" height="146" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
									<feFlood floodOpacity="0" result="BackgroundImageFix"/>
									<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
									<feOffset dx="10" dy="15"/>
									<feGaussianBlur stdDeviation="25"/>
									<feComposite in2="hardAlpha" operator="out"/>
									<feColorMatrix type="matrix" values="0 0 0 0 0.108073 0 0 0 0 0.128516 0 0 0 0 0.3125 0 0 0 0.23 0"/>
									<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3282_7405"/>
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3282_7405" result="shape"/>
								</filter>
							</defs>
						</svg>
						:
						<svg width="1685" height="844" viewBox="0 0 1685 844" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clipPath="url(#clip0_3562_82971)">
								{regions.map((region, index) =>
									<path data={region.key} className='add' d={region.coords}
										  onMouseMove={(e) => {
										  	  e.preventDefault()
											  e.stopPropagation()
											  if (region.isSelected) {
												  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
											  } else {
												  setMarkCoords({...markCoords, visibility: false })
											  }
										  }}
										  onClick={() => {
										  	if (region.isSelected) {
												setSelectedRegion({ key: region.key, index: region.index })
											}
										  }}
										  fill={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : region.isSelected ? (
											  selectedFilter === 2 ?  (
												  {
													  top0: "#ffffff",
													  top3: "#CEEDFF",
													  top10: "#DDF0CE",
													  top30: "#FFE2D2",
													  top50: "#FFE2D2",
												  }[getColor(region.index)]
											  ) : selectedFilter === 0 ? (
												  keywordFilter && curKeyword &&
												  getColorByPos(curKeyword.positionsData[lastUpdate + ":" + projectId + ":" + region.index]?.position)
											  ) : selectedFilter === 1 ? (
												  getColorByTop(region.index)
											  ) : selectedFilter === 3 ? (
											  	getColorByVisibility(groupsFilter < 0 ? Math.round(regionsSummaryFiltered.filter(r => r.index === region.index)[0]?.visibilities[1]) || 0 :
													!groupsForDl['g' + groupsFilter + searchSystem] ?
														groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + region.index] >= 0 ?
															Math.round(groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + region.index]) : ''
														: '')
											  ) : "#EEEFF5"
										  ) : "#EEEFF5" }
										  fillOpacity="1"
										  stroke="#8B98EE"
										  strokeWidth="0.324109"
										  key={index}
									/>
								)}
							</g>
							{selectedFilter === 2 && <>
								<circle cx="567.5" cy="225.5" r="3.5" fill="#8B98EE"/>
								{regions.map((region, index) => region.x && (region.isSelected ?
										{
											top0: <circle className="add" cx={region.x} cy={region.y} r="3.5" fill="#8B98EE" key={index}
														  onMouseMove={(e) => {
															  e.preventDefault()
															  e.stopPropagation()
															  if (region.isSelected) {
																  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
															  } else {
																  setMarkCoords({...markCoords, visibility: false })
															  }
														  }}
														  onClick={() => {
															  if (region.isSelected) {
																  setSelectedRegion({ key: region.key, index: region.index })
															  }
														  }}
											/>,
											top3: <g key={index}
													 onMouseMove={(e) => {
														 e.preventDefault()
														 e.stopPropagation()
														 if (region.isSelected) {
															 setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														 } else {
															 setMarkCoords({...markCoords, visibility: false })
														 }
													 }}
													 onClick={() => {
														 if (region.isSelected) {
															 setSelectedRegion({ key: region.key, index: region.index })
														 }
													 }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
											top10: <g key={index}
													  onMouseMove={(e) => {
														  e.preventDefault()
														  e.stopPropagation()
														  if (region.isSelected) {
															  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														  } else {
															  setMarkCoords({...markCoords, visibility: false })
														  }
													  }}
													  onClick={() => {
														  if (region.isSelected) {
															  setSelectedRegion({ key: region.key, index: region.index })
														  }
													  }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
											top30: <g key={index}
													  onMouseMove={(e) => {
														  e.preventDefault()
														  e.stopPropagation()
														  if (region.isSelected) {
															  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														  } else {
															  setMarkCoords({...markCoords, visibility: false })
														  }
													  }}
													  onClick={() => {
														  if (region.isSelected) {
															  setSelectedRegion({ key: region.key, index: region.index })
														  }
													  }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
											top50: <g key={index}
													  onMouseMove={(e) => {
														  e.preventDefault()
														  e.stopPropagation()
														  if (region.isSelected) {
															  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: region.name, visibility: true, areaName: region.areaName })
														  } else {
															  setMarkCoords({...markCoords, visibility: false })
														  }
													  }}
													  onClick={() => {
														  if (region.isSelected) {
															  setSelectedRegion({ key: region.key, index: region.index })
														  }
													  }}
											>
												<circle cx={region.x} cy={region.y} r="7.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"}/>
												<circle cx={region.x} cy={region.y} r="3.5" fill={region.isActive || region.key === selectedRegion.key ? "white" : "#5BC2FF"} stroke={region.isActive || region.key === selectedRegion.key ? "#5BC2FF" : "white"} strokeWidth="1.4"/>
											</g>,
										}[getColor(region.index)]
										:
										<circle className="add" cx={region.x} cy={region.y} r="3.5" fill="#8B98EE" key={index}/>

								))}
							</>}
							{selectedFilter === 0 && keywordFilter && curKeyword && regions.map((el, index) =>
								<text className="region-text" x={el.x ? el.x - 3 : 0 } y={el.y ? el.y + 15 : 0} key={index}
									  onMouseMove={(e) => {
										  e.preventDefault()
										  e.stopPropagation()
										  if (el.isSelected) {
											  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: el.name, visibility: true, areaName: el.areaName })
										  } else {
											  setMarkCoords({...markCoords, visibility: false })
										  }
									  }}
									  onClick={() => {
										  if (el.isSelected) {
											  setSelectedRegion({ key: el.key, index: el.index })
										  }
									  }}>
									{curKeyword.positionsData[lastUpdate + ":" + projectId + ":" + el.index]?.position}
								</text>
							)}
							{selectedFilter === 3 && regions.map((el, index) => el.isSelected &&
								<text className="region-text" x={el.x ? el.x - 8 : 0 } y={el.y ? el.y + 15 : 0} key={index}
									  onMouseMove={(e) => {
										  e.preventDefault()
										  e.stopPropagation()
										  if (el.isSelected) {
											  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: el.name, visibility: true, areaName: el.areaName })
										  } else {
											  setMarkCoords({...markCoords, visibility: false })
										  }
									  }}
									  onClick={() => {
										  if (el.isSelected) {
											  setSelectedRegion({ key: el.key, index: el.index })
										  }
									  }}>
									{groupsFilter < 0 ? Math.round(regionsSummaryFiltered.filter(r => r.index === el.index)[0]?.visibilities[1]) || '' :
										!groupsForDl['g' + groupsFilter + searchSystem] ?
											Math.round(groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + el.index]) > 0 ?
													Math.round(groupsForDl['g' + groupsFilter + searchSystem + 'data']['r' + el.index]) : ''
											: ''
									}
								</text>
							)}
							{selectedFilter === 1 && regions.map((el, index) =>
								<text className="region-text" x={el.x ? el.x - 3 : 0 } y={el.y ? el.y + 15 : 0} key={index}
									  onMouseMove={(e) => {
										  e.preventDefault()
										  e.stopPropagation()
										  if (el.isSelected) {
											  setMarkCoords({ x: e.pageX - 30, y: e.pageY + 20, name: el.name, visibility: true, areaName: el.areaName })
										  } else {
											  setMarkCoords({...markCoords, visibility: false })
										  }
									  }}
									  onClick={() => {
										  if (el.isSelected) {
											  setSelectedRegion({ key: el.key, index: el.index })
										  }
									  }}>
									{getCountByTop(el.index)}
								</text>
							)}
							<defs>
								<clipPath id="clip0_3562_82971">
									<rect width="1684.89" height="843.242" fill="white" transform="translate(0.112305)"/>
								</clipPath>
							</defs>
						</svg>
					}

					<div className={rightMenuIsOpen ? "right-menu" : "right-menu isCloset" } onMouseEnter={() => {
						setMarkCoords({...markCoords, visibility: false })
					}}>
                        <div className="right-menu__visibility" onClick={() => setRightMenuIsOpen(!rightMenuIsOpen)}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 10.5H7.5V15" stroke="#A1B1C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 7.5H10.5V3" stroke="#A1B1C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10.5 7.5L15.75 2.25" stroke="#A1B1C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.25 15.75L7.5 10.5" stroke="#A1B1C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="right-menu__content" onMouseMove={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setRegions(regions.map(el => { return { ...el, isActive: false }}))
                        }}>

                            {regionsSummaryFiltered.length > 0 && selectedRegion.key >= 0 ? <>
                                <div className="close-region" onClick={() => {
                                    setSelectedRegion({ key: -1, index: -1 })
                                }}><IconCross/></div>
                                <div className="right-menu__selected-region">
                                    <IconMark/>
                                    <span>{regionsSummaryFiltered.filter(el => el.key === selectedRegion.key)[0].name}</span>
                                </div>
                                <div className="right-menu__title">
                                    {getCountByTop(selectedRegion.index)}
                                    &nbsp;запросов в&nbsp;
                                    <span className="blue">
                                        {{
                                            "3": "TOП-3",
                                            "10": "TOП-10",
                                            "30": "TOП-30",
                                            "50": "TOП-50",
                                        }[mainTopFilter.toString()]}
                                    </span>
                                </div>
                                {keywordsListIsLoading ? <PageIsLoading/> :
                                    <div className="keywords-list">
                                        {keywordsStat.keywords.map((el, index) => el.positionsData[lastUpdate + ":" + projectId + ":" + selectedRegion.index]?.position <= mainTopFilter &&
                                            <div className="keywords-list__item" key={index}>
                                                <span className="keywords-list__pos">{el.positionsData[lastUpdate + ":" + projectId + ":" + selectedRegion.index].position}</span>
                                                {el.name}
                                            </div>
                                        )}
                                    </div>
                                }
                            </> : <>
                                {selectedFilter === 0 && <>
                                    <div className="right-menu__title">Регионы</div>
                                    <div className="regions-list">
                                        {curKeyword ?
                                            renderRegionsByKeyword().map((region, index) =>
                                                <div className={false ? "regions-list__item selected" : "regions-list__item"} key={index}>
                                                <span onClick={() => {
                                                    setSelectedRegion({ key: region.key, index: region.index })
                                                }}>
                                                    <span className='num'>{index > 8 ? index + 1 : '0' + (index + 1)}</span>
                                                    {region.name || ("region" + (index + 1))}
                                                    {selectedRegion.key === region.key && keywordsListIsLoading && <LoadingOutlined/>}
                                                </span>
                                                    <p className={
                                                        region.pos < 4 ? "request-count blue" :
                                                            region.pos < 11 ? "request-count green" :
                                                                "request-count"}>
                                                        {region.prePos && region.prePos !== region.pos &&
                                                        <span className={region.pos < region.prePos ? "pos-changed" : "pos-changed red"}>
                                                            {region.pos < region.prePos ? <IconArrowUp/> : <IconArrowDown/> }
                                                            {region.pos > region.prePos ? region.pos - region.prePos : region.prePos - region.pos}
                                                        </span>
                                                        }
                                                        {region.pos} МЕСТО
                                                    </p>
                                                </div>
                                            )
                                            :
                                            <MapNoData>
                                                <p>Выберите ключевое слово</p>
                                            </MapNoData>}
                                    </div>
                                </>}
                                {selectedFilter === 1 && <>
                                    <>
                                        <div className="right-menu__title">Регионы</div>
                                        <div className="regions-list">
                                            {renderRegionsByTop().map((region, index) =>
                                                <div className={false ? "regions-list__item selected" : "regions-list__item"} key={index}>
                                                <span onMouseMove={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setRegions(regions.map(el => el.key === region.key ? { ...el, isActive: true } : { ...el, isActive: false }))
                                                }}
                                                      onClick={() => {
                                                          setSelectedRegion({ key: region.key, index: region.index })
                                                      }}>
                                                    <span className='num'>{index > 8 ? index + 1 : '0' + (index + 1)}</span>
                                                    {region.name || ("region" + (index + 1))}
                                                    {selectedRegion.key === region.key && keywordsListIsLoading && <LoadingOutlined/>}
                                                </span>
                                                    <p className="request-count blue">
                                                        {region.count} ЗАПРОСОВ
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </>}
                                </>}
								{selectedFilter === 2 && <>
									<div className="right-menu__row">
										<SwitchUI onChange={(val) => setRightMenuSwitch(val)} options={[{title: "Регионы", value: "region" }, {title: "Запросы", value: 'requests' }]}/>
									</div>
									<div className="tabs-ui">
										<div className="tabs-ui__content" style={rightMenuSwitch === 'region' ? { "transform": "translate(0)" } :
											{ "transform": "translate(-42.5rem)" }}>
											<div className="tabs-ui__item">
												<div className="right-menu__title">Регионы</div>
												{keywordsListIsLoading ? <PageIsLoading/> : regionsSummaryFiltered.length > 0 &&
													<div className="regions-list">
													{filteredRegions.length > 0 ? filteredRegions.map((region, index) =>
														<div className={false ? "regions-list__item selected" : "regions-list__item"} key={index}>
                                                            <span
																onMouseMove={(e) => {
																	e.preventDefault()
																	e.stopPropagation()
																	setRegions(regions.map(el => el.key === region.key ? { ...el, isActive: true } : { ...el, isActive: false }))
																}}
																onClick={() => {
																	setSelectedRegion({ key: region.key, index: region.index })
																}}
															><span className='num'>{index > 8 ? index + 1 : '0' + (index + 1)}</span>{region.name || ("region" + (index + 1))}</span>
															<p className="request-count">
																{{
																	"3": region.tops[1]["1_3"],
																	"10": region.tops[1]["1_10"],
																	"30": region.tops[1]["1_10"] + region.tops[1]["11_30"],
																	"50": region.tops[1]["1_10"] + region.tops[1]["11_30"] + region.tops[1]["31_50"],
																}[requestsPartTop]} ЗАПРОСОВ
															</p>
														</div>
													) : <MapNoData>
														<p>Нет регионов в которых</p>
														<p>{requestsPart}% запросов</p>
														<p>входит в ТОП{requestsPartTop}</p>
													</MapNoData>}
												</div>
												}
											</div>
											<div className="tabs-ui__item">
												<div className="right-menu__title">Запросы</div>
												<div className="regions-list">
													{keywordsIsLoading ? <PageIsLoading/> :
														keywords.map((region, index) =>
															<div className="regions-list__item" key={index}>
																<span>{region.name || ("region" + (index + 1))}</span>
															</div>
														)}
												</div>
											</div>
										</div>
									</div>
								</>}
                            </>}

                        </div>
                    </div>
                </div>
            }
        </section>
    );
};

export default Map;
