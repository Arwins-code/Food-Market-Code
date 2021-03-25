import Axios from 'axios';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  Button,
  Gap,
  Header,
  ItemListFood,
  ItemValue,
  Loading,
} from '../../components';
import {API_HOST} from '../../config';
import {getData, showMessage} from '../../utils';

const OrderSummary = ({navigation, route}) => {
  const {item, transaction, userProfile} = route.params;
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentURL, setPaymentURL] = useState('https://google.com');

  const onCheckout = () => {
    const data = {
      food_id: item.id,
      user_id: userProfile.id,
      quantity: transaction.totalItem,
      total: transaction.total,
      status: 'PENDING',
    };
    getData('token').then((resToken) => {
      Axios.post(`${API_HOST.url}/checkout`, data, {
        headers: {
          Authorization: resToken.value,
        },
      })
        .then((res) => {
          setIsPaymentOpen(true);
          setPaymentURL(res.data.data.payment_url);
        })
        .catch((err) => {
          showMessage(
            `${err?.response?.data?.message} on Checkout API` ||
              'Terjadi Kesalahan di API Checkout',
          );
        });
    });
  };

  const onNavChange = (state) => {
    // TODO: Use This For Production
    // const urlSuccess =
    //   'http://foodmarket-backend.buildwithangga.id/midtrans/success?order_id=574&status_code=201&transaction_status=pending';
    const titleWeb = 'Laravel';
    if (state.title === titleWeb) {
      navigation.reset({index: 0, routes: [{name: 'SuccessOrder'}]});
    }
  };

  if (isPaymentOpen) {
    return (
      <>
        <Header
          title="Payment"
          subTitle="You deserve better meal"
          onBack={() => setIsPaymentOpen(false)}
        />
        <WebView
          source={{uri: paymentURL}}
          startInLoadingState={true}
          renderLoading={() => <Loading />}
          onNavigationStateChange={onNavChange}
        />
      </>
    );
  }
  return (
    <ScrollView>
      <Header
        title="Order Summary"
        subTitle="You deserve better meal"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={styles.label}>Item Ordered</Text>
        <ItemListFood
          type="order-summary"
          name={item.name}
          price={item.price}
          items={transaction.totalItem}
          image={{uri: item.picturePath}}
        />
        <Text style={styles.label}>Details Transaction</Text>
        <ItemValue
          label={item.name}
          value={transaction.totalPrice}
          type="currency"
        />
        <ItemValue label="Driver" value={transaction.driver} type="currency" />
        <ItemValue label="Tax 10%" value={transaction.tax} type="currency" />
        <ItemValue
          label="Total Price"
          value={transaction.total}
          valueColor="#1ABC9C"
          type="currency"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Deliver to:</Text>
        <ItemValue label="Name" value={userProfile.name} />
        <ItemValue label="Phone No." value={userProfile.phoneNumber} />
        <ItemValue label="Address" value={userProfile.address} />
        <ItemValue label="House No." value={userProfile.houseNumber} />
        <ItemValue label="City" value={userProfile.city} />
      </View>
      <View style={styles.button}>
        <Button text="Checkout Now" onPress={onCheckout} />
      </View>
      <Gap height={40} />
    </ScrollView>
  );
};

export default OrderSummary;

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
