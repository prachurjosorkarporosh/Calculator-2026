#!/usr/bin/env sh
# Gradle wrapper delegate script
DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$DIR/android/gradlew" ]; then
  exec "$DIR/android/gradlew" "$@"
else
  echo "Executing Android build..."
  cd "$DIR/android" && gradle assembleDebug
fi
