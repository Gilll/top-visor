import React, {useEffect, useMemo, useState} from 'react';
import {useApi} from "../hooks/useApi";
import {message, Modal} from "antd";
import PageIsLoading from "../components/PageIsLoading";
import ProjectsHeader from "../components/project/ProjectsHeader";
import EmptyPage from "../components/EmptyPage";
import ProjectListItem from "../components/project/ProjectListItem";
import ProjectForm from "../components/project/ProjectForm";
import {useNavigate} from "react-router";
import {routeNames} from "../router/routeNames";
import {useProjectsApi} from "../hooks/useProjectsApi";

const Projects = () => {
    const [projects, setProjects] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProjects, setFilteredProjects] = useState([])
    const [modalFormIsOpen, setModalFormIsOpen] = useState(false)
    const [serverList, setServerList] = useState([])
    const [yandexList, setYandexList] = useState([])

    const navigate = useNavigate()

    const [getProjects, projectsIsLoading] = useApi({
        url: '/profile-monitoring-system/project/all',
        method: 'GET'
    })

    // const [getProjects, projectsIsLoading] = useProjectsApi({
    //     url: '/project/findAllProjects',
    //     data: {
    //         count: 10000,
    //         numberPage: 0,
    //     }
    // })

    const [getServerList] = useApi({
        url: '/profile-monitoring-system/server/get-all',
        data: {
            count: 10000,
            numberPage: 0
        }
    })

    const [getYandexList] = useProjectsApi({
        url: '/yandexAccount/findAllAccounts',
        data: {
            count: 10000,
            numberPage: 0
        }
    })

    useEffect(() => {
        getProjects().then(resp => {
            setProjects(resp.result)
            console.log(resp.result)
        }).catch(err => message.error(err.message))
        getServerList().then(resp => {
            setServerList(resp.result)
        }).catch(err => message.error(err.message))
        getYandexList().then(resp => {
            setYandexList(resp.result)
        }).catch(err => message.error(err.message))
    },[])

    useMemo(() => {
        setFilteredProjects(projects.filter(el => el.name.includes(searchQuery)))
    },[projects, searchQuery])

    return (
        <section className="main">
            <ProjectsHeader
                projectsCount={projects.length}
                search={searchQuery}
                setSearch={setSearchQuery}
                callAddModal={() => setModalFormIsOpen(true)}
            />
            <div className="main__content projects" id="projects">
                <div className="projects__header">
                    <div>название проекта</div>
                    <div>серверов</div>
                    <div>топвизор</div>
                    <div>статистика кликов</div>
                    <div>ссылка на сайт</div>
                    <div>Карта</div>
                </div>
                <div className="projects__content">
                    {projectsIsLoading ?
                        <PageIsLoading/>
                    :
                        filteredProjects.length > 0 ? filteredProjects.map(project =>
                            <ProjectListItem project={project} key={project.id} callMap={() => navigate(routeNames.map)}/>
                        ) : <EmptyPage/>
                    }
                </div>
            </div>
            <Modal
                open={modalFormIsOpen}
                onCancel={() => {
                    setModalFormIsOpen(false)
                }}
                destroyOnClose={true}
                footer={false}
            >
                <ProjectForm
                    editableProject={false}
                    serverList={serverList}
                    yandexList={yandexList}
                    closeModal={() => setModalFormIsOpen(false)}
                    addNewProject={project => setProjects([...projects, project])}
                />
            </Modal>
        </section>
    );
};

export default Projects;