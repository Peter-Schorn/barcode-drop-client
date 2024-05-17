import React from "react";
import { Component } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../AppContext";

export default function UseContextAdapter(props) {

    const appContext = useContext(props.contextType);

    return (
       props.renderBody(appContext, props)
    );

}
