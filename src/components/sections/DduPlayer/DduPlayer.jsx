import React from "react";
import "./DduPlayer.sass"
import DduCanvas from "./DduCanvas/DduCanvas";


class DduPlyer extends React.Component {
    render() {
        return (
            <section className="DduPlayer">
                <div className="DduPlayer__container">
                    <div className="DduPlayer__input"></div>
                    <DduCanvas/>
                </div>
            </section>
        )
    }
}

export default DduPlyer