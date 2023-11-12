import React from 'react';
import {Route, Routes} from "react-router";
import Main from "../pages/Main";
import {routeNames} from "./routeNames";
import Captcha from "../pages/Captcha";
import Groups from "../pages/Groups";
import Group from "../pages/Group";
import Projects from "../pages/Projects";
import Project from "../pages/Project";
import Settings from "../pages/Settings";
import Versions from "../pages/Versions";
import Networks from "../pages/Networks";
import Monitoring from "../pages/Monitoring";
import Map from "../pages/Map";
import YandexAccounts from "../pages/YandexAccounts";

const AppRouter = () => {
	return (
		<Routes>
			{/*<Route path={routeNames.main} element={<Main/>}/>
			<Route path={routeNames.captcha} element={<Captcha/>}/>
			<Route path={routeNames.groups} element={<Groups/>}/>
			<Route path={routeNames.group + '/:id'} element={<Group/>}/>
			<Route path={routeNames.monitoring + '/:id'} element={<Monitoring/>}/>
			<Route path={routeNames.yandexAccounts} element={<YandexAccounts/>}/>
			<Route path={routeNames.settings} element={<Settings/>}/>
			<Route path={routeNames.versions} element={<Versions/>}/>
			<Route path={routeNames.projects} element={<Projects/>}/>
			<Route path={routeNames.project + '/:id'} element={<Project/>}/>
			<Route path={routeNames.networks} element={<Networks/>}/>
			<Route path={routeNames.map} element={<Map/>}/>*/}
			<Route path={routeNames.map} element={<Map/>}/>
		</Routes>
	);
};

export default AppRouter;
