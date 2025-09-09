# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY ./src .

# Specify the command to run on container startup using Gunicorn
# This runs the Flask app on port 4003 with 2 worker processes
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:4003", "app:app"]