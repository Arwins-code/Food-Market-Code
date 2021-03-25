import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {EmptyOrder, Header, OrderTabSection} from '../../components';
import {getOrders} from '../../redux/action';

const Order = () => {
  const dispatch = useDispatch();
  const {orders} = useSelector((state) => state.orderReducer);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  return (
    <View style={styles.page}>
      {orders.length < 1 ? (
        <EmptyOrder />
      ) : (
        <View style={styles.content}>
          <Header title="Your Orders" subTitle="Wait for the best meal" />
          <View style={styles.tabContainer}>
            <OrderTabSection />
          </View>
        </View>
      )}
    </View>
  );
};

export default Order;

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {flex: 1},
  tabContainer: {flex: 1, marginTop: 24},
});
