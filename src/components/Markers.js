/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome'
import Globe from 'worldwind-react-globe';

class Markers extends Component {
  constructor(props) {
      super(props);
      this.state = {markers: []};

  }
    
  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,       
    globe: PropTypes.instanceOf(Globe),
    markersLayerName: PropTypes.string.isRequired
  }   
  
  static defaultProps = {
    title: 'Markers',
    icon: 'map-marker'
  }
  
  static nextMarkerId = 1;

  addMarker(marker) {
      // Ensure each marker has a unique ID
      if (!marker.uniqueId) {
        marker.uniqueId = Markers.nextMarkerId++;
      }
      // Create a new array from the previous array + marker
      this.setState(prevState => ({ markers: [...prevState.markers, marker]}));
  }


  gotoMarker(marker) {
      this.props.globe.goTo(marker.position.latitude, marker.position.longitude);
  }

  editMarker(marker) {
      alert("TODO: handleEditMarker");
  }

  removeMarker(marker) {
      // Find and remove the marker from the layer and the state array
      const globe = this.props.globe; 
      const layerName = this.props.markersLayerName;
      const markerLayer = globe.getLayer(layerName);
      for (let i = 0, max = this.state.markers.length; i < max; i++) {
          let placemark = markerLayer.renderables[i];
          if (placemark === marker) {
              markerLayer.renderables.splice(i, 1);
              break;
          }
      }
      const markers = this.state.markers.filter(item => item !== marker);
      this.setState({markers: markers});
   }

  render() {
      if (!this.props.globe) {
          return null;
      }
      const self = this;
      function GotoButton(props) {
          return (
              <button type="button" className="btn btn-light" onClick={(e) => self.gotoMarker(props.marker, e)}>
                  <span><img width="16px" height="16px" src={props.marker.attributes.imageSource} alt=""/>  </span>
                  {props.marker.label}
              </button>
          );
      }
      function EditButton(props) {
          return (
              <button type="button" className="btn btn-light" disabled onClick={self.editMarker.bind(self, props.marker)}>
                <FontAwesome name='edit'/>
              </button>
          );
      }
      function RemoveButton(props) {
          return (
            <button type="button" className="btn btn-light" onClick={(e) => self.removeMarker(props.marker, e)}>
              <FontAwesome name='trash'/>
            </button>
          );
      }
      function MarkerItem(props) {
          return (
              <li className="list-group-item list-group-item-action p-0">
                  <div className="btn-group" role="group">
                      <GotoButton marker={props.marker}/>
                      <EditButton marker={props.marker}/>
                      <RemoveButton marker={props.marker}/>
                  </div>
              </li>                
          );
      }
      const markerList = this.state.markers.map((marker) =>
          <MarkerItem key={marker.uniqueId} marker={marker}/>
      );    
      return (
          <div className="card globe-card">
              <div className="card-header">
                  <h5 className="card-title">
                      <FontAwesome name={this.props.icon}/> {this.props.title}
                      <button type="button" className="close pull-right" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button></h5>
              </div>
              <div className="card-body">
                  <ul className="list-group">
                      {markerList}
                  </ul>
              </div>                  
          </div>
      );
  }
}

export default Markers;
