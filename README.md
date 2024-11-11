# GymBro Workout Tracker

<p>GymBro is a React Native app that allows you to track your workouts, making it easier to ensure you are achieving progressive overload without having to make a mess of your favorite notes app. This is a personal project intended to allow me to practice/expand my React Native skills, while also solving a real world problem that I and so many others face.</p>

<h3>How it works</h3>

<p>GymBro allows users to create a list of the workouts they like to do. When a user creates a workout, they define goals for this workout, such as how much weight they wish to lift, how many reps they wish to do, and how many sets they wish to do.</p>

![image](https://github.com/user-attachments/assets/be00f1ba-5d16-4a8a-b965-95a36fdf1af6)

<p>Each workout is then listed in GymBro's "Workouts" page.</p>

![image](https://github.com/user-attachments/assets/f3f2bb60-0a06-46df-b50e-ff38f256f463)

<p>GymBro uses Firestore Database to store data. A user's workouts are stored in a single document, titled with the user's UID. Workouts are stored in a JSON array called 'workouts'. Each workout has an ID that is unique to that workout. The ID of a new workout is one more than the ID of the last element of the 'workouts' array.</p>

![image](https://github.com/user-attachments/assets/74e345b9-b775-42ac-a56c-d6fa74c22187)

<p>When a user is at the gym, they can record the results of their session. When a user presses 'Start' on one of their workouts, they are sent to a page called the "Workout Guide". This page allows users to record how many sets they completed, how many reps they did each set, and how much weight they used for each set.</p>

![image](https://github.com/user-attachments/assets/db188657-fb1c-4d32-8039-f641a069a056)

<p>The workout guide initially loads entries for the amount of sets based on the workout's goal, however users can add and delete sets as they see fit. Users can also change the weight of each set, as is sometimes necessary during a gym session.</p>

![image](https://github.com/user-attachments/assets/1fa20fe7-ce1d-400b-92ac-9cb24d9b2325)

<p>Recorded workout sessions are recorded by the set. They are stored in a single document, and each set is saved as a JSON object in an array called 'workouts'. Each set is recorded with the actual reps and weight achieved, along with a 'date' variable and the name and ID of the workout recorded.</p>

![image](https://github.com/user-attachments/assets/eafeb502-048b-4d41-bd22-0511a17669c0)

<p>Users can monitor their progress through GymBro's Progress page. The progress page shows a list of each set the user has recorded, and includes a Weight Tracker.</p>
<p><i>Note: The Progress page is an extreme WIP.</i></p>

![image](https://github.com/user-attachments/assets/addc1bde-d9b8-43f3-8439-22905733966b)

<p>Users can log their body weight by conducting a 'Weigh-in'. Their weight is saved as a JSON object with their weight, and the date that weight was recorded.</p>

![image](https://github.com/user-attachments/assets/461c3488-3c79-47ef-9016-787f8a6f8980)

![image](https://github.com/user-attachments/assets/cb0eddcd-2f8c-402f-8c31-6f49563ce62e)

