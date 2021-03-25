import Axios from 'axios';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button, Gap, Header, ItemListFood, ItemValue} from '../../components';
import {API_HOST} from '../../config';
import {getData, showMessage} from '../../utils';

const OrderDetail = ({route, navigation}) => {
  const order = route.params;

  const onCancel = () => {
    const data = {
      status: 'CANCELLED',
    };
    getData('token').then((resToken) => {
      Axios.post(`${API_HOST.url}/transaction/${order.id}`, data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          navigation.reset({
            index: 0,
            routes: [{name: 'MainApp'}],
          });
        })
        .catch((err) => {
          showMessage(
            `${err?.response?.data?.message} on Cancel Order API` ||
              'Terjadi Kesalahan di Cancel Order API',
          );
        });
    });
  };
  return (
    <ScrollView>
      <Header
        title="Payment"
        subTitle="You deserve better meal"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={styles.label}>Item Ordered</Text>
        <ItemListFood
          type="order-summary"
          name={order.food.name}
          price={order.food.price}
          items={order.quantity}
          image={{uri: order.food.picturePath}}
        />
        <Text style={styles.label}>Details Transaction</Text>
        <ItemValue
          label={order.food.name}
          value={order.food.price * order.quantity}
          type="currency"
        />
        <ItemValue label="Driver" value={50000} type="currency" />
        <ItemValue
          label="Tax 10%"
          value={(10 / 100) * order.total}
          type="currency"
        />
        <ItemValue
          label="Total Price"
          value={order.total}
          valueColor="#1ABC9C"
          type="currency"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Deliver to:</Text>
        <ItemValue label="Name" value={order.user.name} />
        <ItemValue label="Phone No." value={order.user.phoneNumber} />
        <ItemValue label="Address" value={order.user.address} />
        <ItemValue label="House No." value={order.user.houseNumber} />
        <ItemValue label="City" value={order.user.city} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Order Status:</Text>
        <ItemValue
          label={`#${order.id}`}
          value={order.status}
          valueColor={order.status === 'CANCELLED' ? '#D9435E' : '#1ABC9C'}
        />
      </View>
      <View style={styles.button}>
        {order.status === 'PENDING' && (
          <Button
            text="Cancel My Order"
            onPress={onCancel}
            color="#D9435E"
            textColor="white"
          />
        )}
      </View>
      <Gap height={40} />
    </ScrollView>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#020202',
    marginBottom: 8,
  },
  button: {paddingHorizontal: 24, marginTop: 24},
});
