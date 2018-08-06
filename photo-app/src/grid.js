
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
const request = require('superagent');
class App extends Component {

<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden' }} >
          <GridList spacing={10} cellHeight={180} style={{ width: 800, height: 450 }}>
            <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
              <ListSubheader component="div" style={{ fontSize: 20 }}>Trending</ListSubheader>
            </GridListTile>
            {
              this.rs.map((data) => {
                return (
                  <GridListTile cols={.5} >
                    <img src={data.image} alt={data.alt} />
                    <GridListTileBar
                      header={data.name}
                      title={data.desc}
                      subtitle={<span> by:{data.au} </span>}
                      actionIcon={
                        <IconButton style={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                          <InfoIcon />
                        </IconButton>
                      }
                    />
                  </GridListTile>
                )
              })
            }
            </GridList>
        </div>

  export default App;