<div align="center">

# LogShield Studio

<img width="120" height="120" alt="logshield_studio_logo" src="./src-tauri/icons/128x128.png" />

**Advanced Log Analysis & Privacy Redaction Suite**

[![Rust](https://img.shields.io/badge/Rust-1.75+-2f2359?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org)
&nbsp;
[![Tauri](https://img.shields.io/badge/Tauri-V2-ffc130?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app)
&nbsp;
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

<p align="center">
  <img src="https://img.shields.io/badge/Platform-8A8A8A?style=for-the-badge" /><img src="https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white" /><img src="https://img.shields.io/badge/Windows-0078D4?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDMuNDQ5TDkuNzUgMi4xdjkuNDUxSDBWMy40NDl6bTkuNzUgOS4xMzlWMjIuMWwtOS43NS0xLjM1MVYxMi41ODloOS43NXptMS41LTkuNTM5TDI0IDB2MTEuNTVoLTEyLjc1VjMuMDR6bTEyLjc1IDkuNTRWMjRsLTEyLjc1LTMuMTVWMTIuNThIMjR6Ii8+PC9zdmc+&logoColor=white" /><img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" />
</p>

[![Security](https://img.shields.io/badge/Security-Local--Processing-05a32f?style=for-the-badge)](/)

---

Experience lightning-fast log analysis and seamless privacy redaction. Identify security risks and mask sensitive data instantly with a native macOS experience.

[🇹🇷 Türkçe README için tıklayın](./README_TR.md)

</div>

---

## 📋 Table of Contents

- [🎯 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Technologies](#️-technologies)
- [🚀 Installation & Usage](#-installation--usage)
- [🛡️ Privacy & Security](#️-privacy--security)
- [👤 Developer](#-developer)

---

## 🎯 About the Project

**LogShield Studio** is a professional-grade tool designed for security engineers and developers who handle sensitive log data. It eliminates the risk of accidental data leaks by identifying PII (Personally Identifiable Information), credentials, and security vulnerabilities within log files. Built with a "Privacy-First" architecture, all analysis happens locally on your device—no data is ever sent to the cloud.

---

## ✨ Features

| Feature | Description |
|---------|----------|
| ⚡ **Turbo Engine** | High-speed log scanning powered by a specialized Rust backend. |
| 🛡️ **Smart Redaction** | Auto-detects and masks IPs, emails, passwords, and sensitive keys. |
| 🖱️ **Native Drag & Drop** | Seamlessly drop logs anywhere in the interface to start analysis. |
| 📊 **Risk Scoring** | Instant risk assessment of log content with a visual scoring system. |

---

## 🛠️ Technologies

<div align="center">

| Category | Technology |
|:--------:|:---------:|
| **Backend** | ![Rust](https://img.shields.io/badge/Rust-black?style=flat-square&logo=rust&logoColor=white) ![Tauri](https://img.shields.io/badge/Tauri_V2-24C8D8?style=flat-square&logo=tauri&logoColor=white) |
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| **Analysis** | ![Regex](https://img.shields.io/badge/Regex-Pattern_Matching-red?style=flat-square) ![Risk](https://img.shields.io/badge/Risk-Analysis_Engine-orange?style=flat-square) |
| **Platform** | ![macOS](https://img.shields.io/badge/macOS-000000?style=flat-square&logo=apple&logoColor=white) ![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white) ![Linux](https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black) |

</div>

---

## 🖥️ Screenshots

<div align="center">

#### 📊 Main Interface

  <img width="600" alt="Main Interface" src="https://github.com/user-attachments/assets/199e789c-6609-4c29-90c9-27019583ab1a"/>
</p>



#### 🔍 Interactive Redaction
<p align="center">
      <img width="600" alt="Redaction View" src="https://github.com/user-attachments/assets/521404dd-be89-4967-99f1-6c7f0bd62101"/></td>
</p>

</div>

---

## 🚀 Installation & Usage

### 1. Download & Installation
Download the latest version from the [Releases](https://github.com/kayaberkkan/logshield-studio/releases) page.

- **macOS:** Open `LogShield Studio.dmg`, drag the app to your Applications folder, and launch it.
- **Windows:** Run the `.exe` installer.
- **Linux:** Install the `.deb` package.

### 2. Usage Steps
1. Launch LogShield Studio.
2. Drag and drop any `.log` or `.txt` file into the main window.
3. Review detected risks and masked information in the interactive split view.
4. Export the redacted log safely for sharing or further analysis.

---

## 🛡️ Privacy & Security

LogShield Studio is built on the principle of **Zero-Cloud Trust**:
- **Local Processing:** All pattern matching and redaction logic runs entirely on your local machine.
- **No Telemetry:** We do not track your usage or collect any data from the logs you analyze.
- **In-Memory Analysis:** Data is processed in-memory and is never stored in temporary or cloud buffers.

---

## 👤 Developer

<div align="left">

**Berkkan KAYA**

[![GitHub](https://img.shields.io/badge/GitHub-kayaberkkan-181717?style=for-the-badge&logo=github)](https://github.com/kayaberkkan)

</div>

---
