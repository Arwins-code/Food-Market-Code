import Axios from 'axios';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Select, TextInput} from '../../components';
import {API_HOST} from '../../config';
import {getData, showMessage, storeData, useForm} from '../../utils';

const EditProfile = ({navigation}) => {
  const [form, setForm] = useForm({
    name: '',
    email: '',
    address: '',
    city: '',
    houseNumber: '',
    phoneNumber: '',
  });

  const onSubmit = () => {
    let resultObj = {};
    Object.keys(form).map((obj) => {
      if (form[obj]) {
        resultObj[obj] = form[obj];
      }
    });
    getData('token').then((resToken) => {
      Axios.post(`${API_HOST.url}/user`, resultObj, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          showMessage('Update Success', 'success');
          storeData('userProfile', res.data.data).then(() => {
            navigation.reset({index: 0, routes: [{name: 'MainApp'}]});
          });
        })
        .catch((err) => {
          showMessage(
            `${err?.response?.data?.message} on Update Profile API` ||
              'Terjadi kesalahan di API Update Profile',
          );
        });
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.page}>
        <Header
          title="Edit Profile"
          subTitle="Update your profile"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <TextInput
            label="Full Name"
            placeholder="Type your full name"
            value={form.name}
            onChangeText={(value) => setForm('name', value)}
          />
          <Gap height={16} />
          <TextInput
            label="Email Address"
            placeholder="Type your email address"
            value={form.email}
            onChangeText={(value) => setForm('email', value)}
          />
          <Gap height={16} />
          <TextInput
            label="Address"
            placeholder="Type your address"
            value={form.address}
            onChangeText={(value) => setForm('address', value)}
          />
          <Gap height={16} />
          <TextInput
            label="House Number"
            placeholder="Type your house number"
            value={form.email}
            onChangeText={(value) => setForm('houseNumber', value)}
          />
          <Gap height={16} />
          <TextInput
            label="Phone Number"
            placeholder="Type your phone number"
            value={form.email}
            onChangeText={(value) => setForm('phoneNumber', value)}
          />
          <Gap height={16} />
          <Select
            label="City"
            value={form.city}
            onSelectChange={(value) => setForm('city', value)}
          />
          <Gap height={24} />
          <Button text="Update" onPress={onSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  scroll: {flexGrow: 1},
  page: {flex: 1},
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 26,
    marginTop: 24,
    flex: 1,
  },
});
