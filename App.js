import React from 'react';
import { View , StyleSheet , TextInput , ScrollView } from 'react-native';
import { Text, Icon, Button } from "native-base";
import MapView from 'react-native-maps';
import { Marker , AnimatedRegion , Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class App extends React.Component {
constructor(props)
{
  super(props);
  console.disableYellowBox = true;
  this.state = {apiKey : 'AIzaSyAjAH01s0RhAAtjr29PbelSYFrLmx_w8WI' , from : null, to : null};
}

map;

render()
{
  return (
    <View style={styles.parent}>
      <Text style={StyleSheet.flatten([styles.title , {marginTop:48,marginLeft:24}])}>Hey <Text style={StyleSheet.flatten([styles.title,{color:"#fd9644",fontWeight:"500"}])}>User</Text></Text>
      <View style={{flex:1,justifyContent:"flex-end",alignItems:"center"}}>
      <GooglePlacesAutocomplete
      placeholder='From ..'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed={false}    // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        var location = details.geometry.location;
        location.latitude = location.lat;
        location.longitude = location.lng;
        this.setState({from:location});
      }}

      getDefaultValue={() => ''}

      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: this.state.apiKey,
        language: 'en', // language of the results
        types: '(cities)' // default: 'geocode'
      }}

      styles={{
        textInputContainer: {
          width: '100%',
          backgroundColor:"rgba(0,0,0,0)",
          margin: 20,
          zIndex:-1
        },
        container: {
          maxHeight: 44
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        },
        listView: {
          minHeight : 240,
          backgroundColor:"#FFF",
          zIndex:10
        }
      }}

      currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        type: 'cafe'
      }}
      
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address',
      }}

      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      renderLeftButton={()  => <Icon style={{alignSelf:"center",color:"#4cd137"}} name="location-pin" type="Entypo" />}
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    />

    <GooglePlacesAutocomplete
      placeholder='To ..'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      listViewDisplayed={false}    // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
      var location = details.geometry.location;
        location.latitude = location.lat;
        location.longitude = location.lng;
        this.setState({to:location});
      }}

      getDefaultValue={() => ''}

      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: this.state.apiKey,
        language: 'en', // language of the results
        types: '(cities)' // default: 'geocode'
      }}

      styles={{
        textInputContainer: {
          width: '100%',
          backgroundColor:"rgba(0,0,0,0)",
          margin: 20,
          zIndex:-1
        },
        container: {
          zIndex:-1
        },
        textInput: {
          zIndex:-1
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        },
        listView: {
          minHeight : 240,
          backgroundColor:"#FFF",
          zIndex:10
        }
      }}

      currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
      }}
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        type: 'cafe'
      }}
      
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address',
      }}

      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      renderLeftButton={()  => <Icon style={{alignSelf:"center",color:"#00a8ff"}} name="location-pin" type="Entypo" />}
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    />

      <Button onPress = {() => {
          if (this.state.from == null || this.state.to == null)
             return
          
          var addDelta = {latitudeDelta : 2 , longitudeDelta : 2};
          var to = Object.assign(addDelta , this.state.to);

          var rn = new AnimatedRegion(to);
          this.map.animateToRegion(rn,6000);
        }
      } style={{width:50,marginBottom:100,borderRadius:100,justifyContent:"center",height:50}}>
       <Icon name="play" />
      </Button>

      <MapView ref={(map) => { this.map = map; }} camera={{pitch: 8 , zoom : 8 , heading : 8 , altitude : 8 , center : this.state.from ? this.state.from : { latitude : 37.0902 , longitude : 95.7129 }}} style={{height:450,width:"100%"}} provider="google" zoomControlEnabled={true} zoomEnabled={true}>
         {this.state.from != null && <Marker pinColor="#4cd137" coordinate={this.state.from} title="From" />}
         {this.state.to && <Marker pinColor="#00a8ff" coordinate={this.state.to} title="To" />}
         {this.state.from && this.state.to && <Polyline coordinates={[this.state.from,
			   this.state.to ]} strokeColors={['#e84118','#B24112' ]} strokeWidth={4} />}</MapView>
      </View>
    </View>
  );
}
};

export default App;

const styles = StyleSheet.create({
  parent : {
    flex:1
  },
  title : {
    fontSize : 24,
    color:"#2C3A47"
  }
});