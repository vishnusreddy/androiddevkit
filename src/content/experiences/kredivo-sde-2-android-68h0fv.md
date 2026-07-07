---
company: "Kredivo"
role: "SDE 2 Android"
level: "Mid"
location: "Remote"
remote: true
outcome: "Rejected"
date: 2026-07-04
author: "RobotMan07"
tags: ["dsa"]
draft: false
---

I applied for the role on LinkedIn - got a call back from their HR within 15 minutes. 

It was a general discussion regarding tech stack, company, current work, reasons for wanting to switch, notice period and so on. Post that I was informed that the profile would be shared with the hiring manager and that they would get back to me. And he did - exactly 2 days later I got a call that they would like to proceed with an interview, and it was scheduled via a third party platform called InterviewVector. 

## Round 1

The interview was over Google Meet. The interviewer was not from Kredivo. He was someone from the third party platform InterviewVector. I did not like the fact that they had switch off their camera and expected me to turn on mine. 

It started off with resume discussion, about tech stack, projects I'm working on at my current company. They went a bit in detail - maybe to give the illusion that they are actually listening to what I was saying. Post that I was informed that there would be 2 DSA questions. 

### Problem 1

Input is a string which contains stars and other characters. The output should be another string which has the stars and it's preceding characters removed. 

```
Simple Case: macb*ook -> macook
Multiple Stars: macb**ook -> maook
Leading Star: *macbook -> macbook
All Stars: ab*** -> `` (empty string)
No Stars: macbook -> macbook
Alternating: a*b*c*d -> d
```

### Problem 2

Given an array of 2D coordinates, determine if they all lie on a single straight line.

```
○ Standard Line: [(0, 0), (1, 1), (2, 2), (5, 5)] -> true
○ Standard Non-Line: [(0, 0), (1, 1), (1, 2)] -> false
○ Vertical Line: [(1, 1), (1, 2), (1, 5)] -> true
○ Horizontal Line: [(1, 2), (2, 2), (5, 2)] -> true
○ Fewer than 3 points: [(5, 5), (10, 10)] -> true
○ Negative Coordinates: [(-1, -1), (0, 0), (1, 1)] -> true
```

  
I was able to solve problem 1 without hints, but for the second problem I was able to solve with hints - USE THE CONCEPT OF SLOPE! Which we learnt in high school. 

After this we ended the interview. After about a day, I was informed that I was not selected and was asked to improve my DSA skills as feedback. 

Thanks!
