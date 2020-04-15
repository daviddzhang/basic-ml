import React from "react"
import './PageLayout.css'

class PageLayout extends React.Component {
    render() {
        return (
            <div className="page-layout">
                    {this.props.children}
            </div>
        )
    }
}

export default PageLayout