import React, { useState, useEffect } from "react";
import { requestGetCountryList } from "../../../services/backend_helper";   
import { Dropdown } from "react-native-element-dropdown";

const CountryDropDown = (props: any) => {
  const { handleInputChange, country } = props;

  const [countryData, setCountryData] = useState([]);
  const fetchCountryData = async () => {
    await requestGetCountryList().then((res) => {
      if (!res.isError) {
        // console.log(res.data.label);
        setCountryData(res.data);
      }
    });
  };
  useEffect(() => {
    fetchCountryData();
  }, []);

  return (
    <Dropdown
      data={countryData}
      style={{
        height: 40,
        paddingHorizontal: 5,
        backgroundColor: "white",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
      }}
      selectedTextProps={{ selectionColor: "black" }}
      itemTextStyle={{ paddingLeft: 10 }}
      statusBarIsTranslucent={true}
      inputSearchStyle={{
        height: 40,
        // fontSize: 16,
      }}
      selectedTextStyle={{ color: "black" }}
      labelField="label"
      valueField="value"
      placeholder={"Select Country"}
      searchPlaceholder="Search..."
      value={country}
      onChange={(item: any) => {
        handleInputChange("country", item.value);
      }}
    />
  );
};

export default CountryDropDown;
