@echo off
rem O gradlew so roda com JAVA_HOME. O JDK que vem com o Android Studio serve
rem (o Gradle 9.1 aceita o Java 25 dele), entao nao precisa instalar outro.
if not defined JAVA_HOME set "JAVA_HOME=C:/Program Files/Android/Android Studio/jbr"
cd /d "%~dp0../android"
call "%~dp0../android/gradlew.bat" %*
