
//import AppBar from 'navservice';
import { Grid } from "@mui/material";
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
const AppBar = React.lazy(() => import("navservice/AppBar"))
const Router = React.lazy(() => import("navservice/Router"))
const Routes = React.lazy(() => import("navservice/Routes"))

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
function App() {
  return (
    <Suspense fallback={<div> loading...</div>}>
      <Router>
        <div style={styles.frame}>
          <AppBar />
          {/*<ZebAppBar pmProxy={this.appBarProxy} className={classes.appbar} />*/}
          <Grid container style={styles.container} direction="column" wrap="nowrap">
            <Routes>
              <Route path="/servicea" element={
                <>
                  <div>Service A</div>
                  <p>Goto Service B <a>/serviceb</a></p>
                </>
              } />
            </Routes>
          </Grid>
        </div>
      </Router>
    </Suspense>

  );
}

export default App;
