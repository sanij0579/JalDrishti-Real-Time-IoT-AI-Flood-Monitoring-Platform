import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import { useRouter } from "expo-router";
import { themes } from "../constants/themes";

export default function MobileInputPage() {
  const router = useRouter();
  const { colors, fonts, sizes } = themes.redBackground; // 🎯 Use the new theme

  // ⚡ Fix TypeScript error by using CountryCode type
  const [countryCode, setCountryCode] = useState<CountryCode>("IN");
  const [callingCode, setCallingCode] = useState("+91");
  const [mobile, setMobile] = useState("");

  return (
    <SafeAreaView
      className="flex-1 px-6"
      style={{ backgroundColor: colors.background }}
    >
      
      
      {/* Skip button top right */}
      <View className="flex-row justify-end mt-4">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="flex-row items-center"
        >
          <Text
            style={{
              color: colors.buttonSecondary,
              fontFamily: fonts.medium,
              fontSize: sizes.font,
              marginRight: 4,
            }}
          >
            Skip
          </Text>
          <Text
            style={{
              color: colors.buttonSecondary,
              fontFamily: fonts.medium,
              fontSize: sizes.font,
            }}
          >
            →
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center">
        {/* Logo */}
        <Image
          source={require("../assets/logo.png")}
          className="w-32 h-32 mb-4"
          style={{ resizeMode: "contain" }}
        />

       <Text
  style={{
    fontSize: 34,
    fontFamily: fonts.bold,
    color: colors.text,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  }}
>
  🌊 जलDrishti 🌊
</Text>

        {/* Tagline */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.regular,
            color: colors.textSecondary,
            marginTop: 6,
            textAlign: "center",
            paddingHorizontal: 24,
            lineHeight: 22,
          }}
        >
          Transforming ideas into impactful projects for communities.
        </Text>

        {/* Mobile Input with Country Picker */}
        <View className="w-full mt-12">
          <Text
            style={{
              color: colors.text,
              fontSize: sizes.heading,
              fontFamily: fonts.medium,
              marginBottom: 8,
            }}
          >
            Enter Mobile Number
          </Text>

          <View
            className="flex-row w-full border rounded items-center"
            style={{
              borderColor: colors.cardBorder,
              borderRadius: sizes.radius,
              paddingHorizontal: 8,
            }}
          >
            {/* Country Picker */}
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withAlphaFilter
              onSelect={(country) => {
                setCountryCode(country.cca2 as CountryCode); // ✅ cast to CountryCode
                setCallingCode("+" + country.callingCode[0]);
              }}
              containerButtonStyle={{
                marginRight: 8,
              }}
            />

            {/* Mobile input */}
            <Text style={{ fontSize: 16 }}>{callingCode}</Text>
            <TextInput
              placeholder="Enter mobile number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              className="flex-1 px-2"
              style={{
                color: colors.text,
                fontFamily: fonts.medium,
                fontSize: 18,
              }}
              value={mobile}
              onChangeText={setMobile}
            />
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="items-center w-full mt-8 shadow-md"
          style={{
            backgroundColor: colors.buttonPrimary,
            padding: sizes.padding,
            borderRadius: sizes.radius,
          }}
        >
          <Text
            style={{
              color: colors.buttonTextPrimary,
              fontSize: 16,
              fontFamily: fonts.bold,
              letterSpacing: 0.5,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}