import React from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <RiIcons.RiDashboardFill/>,
    cName: "nav-text",
  },
  {
    title: "DDRs EMBRATEL",
    path: "/ddrs-embratel",
    icon: <MdIcons.MdSettingsPhone/>,
    cName: "nav-text",
  },
  {
    title: "Licenças Genesys",
    path: "/licensas-genesys",
    icon: <FaIcons.FaUsers/>,
    cName: "nav-text",
  },
];
