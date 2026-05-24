/* Calamares installer slideshow for Cryogram OS */
import QtQuick 2.0
import calamares.slideshow 1.0

Presentation {
  id: presentation
  Timer {
    interval: 5000
    running: true
    repeat: true
    onTriggered: presentation.goToNextSlide()
  }

  Slide {
    Rectangle {
      anchors.fill: parent
      color: "#0a0e14"
      Column {
        anchors.centerIn: parent
        spacing: 20
        Text {
          text: "Welcome to Cryogram OS"
          font.pixelSize: 32
          font.bold: true
          color: "#00d4ff"
          anchors.horizontalCenter: parent.horizontalCenter
        }
        Text {
          text: "A security-first desktop OS built for professionals."
          font.pixelSize: 16
          color: "#c9d1d9"
          anchors.horizontalCenter: parent.horizontalCenter
        }
      }
    }
  }

  Slide {
    Rectangle {
      anchors.fill: parent
      color: "#0a0e14"
      Column {
        anchors.centerIn: parent
        spacing: 20
        Text {
          text: "Cryogram — Your Security Hub"
          font.pixelSize: 28
          font.bold: true
          color: "#00d4ff"
          anchors.horizontalCenter: parent.horizontalCenter
        }
        Text {
          text: "Terminal · Code Editor · Password Tester\nShodan · Breach Monitor · Pre-installed Security Tools"
          font.pixelSize: 15
          color: "#c9d1d9"
          horizontalAlignment: Text.AlignHCenter
          anchors.horizontalCenter: parent.horizontalCenter
        }
      }
    }
  }

  Slide {
    Rectangle {
      anchors.fill: parent
      color: "#0a0e14"
      Column {
        anchors.centerIn: parent
        spacing: 20
        Text {
          text: "Full Security Toolkit"
          font.pixelSize: 28
          font.bold: true
          color: "#00ff88"
          anchors.horizontalCenter: parent.horizontalCenter
        }
        Text {
          text: "Nmap · Wireshark · Metasploit · Hashcat\nAircrack-ng · Burp Suite · SQLmap · Bettercap\nand 100+ more tools pre-installed."
          font.pixelSize: 15
          color: "#c9d1d9"
          horizontalAlignment: Text.AlignHCenter
          anchors.horizontalCenter: parent.horizontalCenter
        }
      }
    }
  }

  Slide {
    Rectangle {
      anchors.fill: parent
      color: "#0a0e14"
      Column {
        anchors.centerIn: parent
        spacing: 20
        Text {
          text: "Full Development Environment"
          font.pixelSize: 28
          font.bold: true
          color: "#bb88ff"
          anchors.horizontalCenter: parent.horizontalCenter
        }
        Text {
          text: "Python · Node.js · Rust · Go · C/C++\nMonaco Editor · Git · Docker\nAll pre-installed and ready."
          font.pixelSize: 15
          color: "#c9d1d9"
          horizontalAlignment: Text.AlignHCenter
          anchors.horizontalCenter: parent.horizontalCenter
        }
      }
    }
  }
}
