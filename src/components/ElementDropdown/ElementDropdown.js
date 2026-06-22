import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, Keyboard} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ElementDropdown = ({
  data,
  value,
  onChange,
  placeholder,
  labelField = 'label',
  valueField = 'value',
  disabled = false,
  loading = false,
  search = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No items found',
  renderLeftIcon,
  ...props
}) => {
  const renderItem = (item) => (
    <View style={styles.item}>
      {item.flag && <Text style={styles.flag}>{item.flag}</Text>}
      <Text style={styles.itemText}>{item[labelField]}</Text>
    </View>
  );

  const renderRightIcon = () => {
    if (loading) {
      return <ActivityIndicator size="small" color="#999" />;
    }
    return (
      <Icon
        name={disabled ? 'lock-outline' : 'arrow-drop-down'}
        size={24}
        color={disabled ? '#999' : '#333'}
      />
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="small" color="#999" />
      ) : (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      )}
    </View>
  );

  return (
    <Dropdown
      style={[styles.dropdown, disabled && styles.disabled]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={styles.containerStyle}
      itemTextStyle={styles.itemTextStyle}
      itemContainerStyle={styles.itemContainer}
      activeColor="#f5f5f5"
      data={data || []}
      labelField={labelField}
      valueField={valueField}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disable={disabled}
      renderItem={renderItem}
      renderRightIcon={renderRightIcon}
      renderLeftIcon={renderLeftIcon}
      showsVerticalScrollIndicator={false}
      search={search}
      searchPlaceholder={searchPlaceholder}
      keyboardAvoiding={true}
      flatListProps={{
        keyboardShouldPersistTaps: 'handled',
        ListEmptyComponent: renderEmptyComponent,
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  disabled: {
    backgroundColor: '#f9f9f9',
    borderColor: '#eee',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  containerStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    maxHeight: 300,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
  },
  itemTextStyle: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ElementDropdown;
