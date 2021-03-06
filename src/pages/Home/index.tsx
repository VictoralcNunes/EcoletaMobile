import React, { useState, useEffect } from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

interface IBGEUFResponse{
  sigla: string
}

interface IBGECityResponse{
  nome: string
}

interface FormatPickerSelect {
  label: string,
  value: string
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<FormatPickerSelect[]>([]);
  const [cities, setCities] = useState<FormatPickerSelect[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();
  
  useEffect(()=>{
    async function loadUfs(){

      const response = await axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      
      const ufInitials = response.data.map(uf => {
        return {
          label: uf.sigla,
          value: uf.sigla
        }
      });            
      setUfs(ufInitials);
      
    }
    loadUfs();
  },[]);

  useEffect(()=>{
    async function loadCities(){
      if(selectedUf === '0'){
        return;
      }

      const response = await axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      
      const cityNames = response.data.map(city => {
        return {
          label: city.nome,
          value: city.nome,
        };
      });            
      setCities(cityNames);
      
    }
    loadCities();
      
  },[selectedUf]);

  function handleNavigateToPoints(){
    if (selectedUf === '0' || selectedCity === '0')
    Alert.alert('Ooops...', 'Precisamos que selecione a uf e a cidade.');
  else
    navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
  }
  


  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
          source={require('../../assets/home-background.png')}
          style={styles.container}
          imageStyle={{ width: 274, height: 368}}
          >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')}/>
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>
        {ufs.length > 0 && (
          <RNPickerSelect
            style={{ ...pickerSelectStyles }}
            onValueChange={(value) => {
              setSelectedUf(String(value));
              setSelectedCity('0');
            }}
            items={ufs}
          />
        )}

        {selectedUf !== '0' && (
          <RNPickerSelect
            style={{ ...pickerSelectStyles }}
            onValueChange={(value) => setSelectedCity(String(value))}
            items={cities}
          />
        )}
          {/* <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={selectedUf}
            onChangeText={setSelectedUf}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={2}
            /> 
          <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={selectedCity}
            autoCorrect={false}
            onChangeText={setSelectedCity}
            />  */}
          <RectButton 
              style={styles.button} 
              onPress={handleNavigateToPoints}>
                  <View style={styles.buttonIcon}>
                      <Text>
                          <Icon name="arrow-right" color="#FFF" size={24} />
                      </Text>
                  </View>
                  <Text style={styles.buttonText}>
                      Entrar
                  </Text>
          </RectButton>
        <View style={styles.footer}>

        </View>
        
      </ImageBackground>
    </KeyboardAvoidingView>);
};


const pickerSelectStyles = StyleSheet.create({
  viewContainer: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  inputAndroid: {
    color: '#322153'
  },

  inputIOS: {
    color: '#322153'
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;