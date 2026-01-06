import { Cat } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Mendapatkan lebar layar
const { width } = Dimensions.get('window');

// ----- PENGATURAN TINGGI (Tetap sama seperti yang sudah pas tadi) -----
const headerHeight = 200;
const sideHeight = headerHeight;
const centerControlHeight = headerHeight - 40;

const PawsHeader = () => {
  // Data jalur lengkungan
  const pathData = `M0 0 H${width} V${sideHeight} Q${width / 2} ${centerControlHeight} 0 ${sideHeight} Z`;

  return (
    <View style={styles.headerContainer}>
      {/* Latar Belakang SVG */}
      <Svg
        height={headerHeight}
        width={width}
        viewBox={`0 0 ${width} ${headerHeight}`}
        style={styles.svgBackground}
      >
        <Path
          fill="#AEE637" // Warna Hijau P4WS
          d={pathData}
        />
      </Svg>

      {/* Konten Header (Teks & Ikon) */}
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>P4WS.</Text>
        <View style={styles.iconContainer}>
          <Cat size={80} color="black" fill="black" style={styles.catIcon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: width,
    height: headerHeight,
    position: 'relative',
    backgroundColor: 'transparent',
    zIndex: 10,
    marginBottom: 20, 
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    // SAYA SUDAH MENGHAPUS SEMUA KODE SHADOW/ELEVATION DI SINI
    // Agar tampilannya flat dan bersih.
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 45, 
  },
  headerText: {
    fontSize: 40,
    fontWeight: '900',
    color: 'black',
    letterSpacing: 1,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 35, 
    right: 30,  
  },
  catIcon: {
    transform: [{ rotate: '-10deg' }],
  }
});

export default PawsHeader;