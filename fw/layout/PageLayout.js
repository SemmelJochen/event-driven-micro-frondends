import React from 'react'

const styles = ({
    frame: {
        height: "100%",
        display: "flex",
        flexDirection: "column", // children will be rendered below each other, DO NOT WRAP!
    },
    appbar: {
        flex: 1, // be flexible, but use 1 / 2001 of space initially (height of AppBar will be set in AppBar)
    },
    container: {
        flex: 2000, // be flexible, but use 2000/2001 (almost all space you can get) for the content-container
        display: "flex", // the container is a flex-container itself
    },
    contentGrid: {
        display: "flex",
        flex: "1",
    },
});

export const PageLayout = ({appBar, content, children}) => {
    return (
        <div style={styles.frame}>
            {appBar}
            {/*<ZebAppBar pmProxy={this.appBarProxy} className={classes.appbar} />*/}
            <Grid container className={styles.container} direction="column" wrap="nowrap">
                {content ? content : children}
            </Grid>
        </div>
    )
}
