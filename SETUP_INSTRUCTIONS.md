# How to connect your Contact Form to Google Sheets & Gmail

Since we are in Mockup Mode, the contact form currently simulates a submission. To make it functional without a backend server, follow these steps to use **Google Apps Script**. This method is free and sends data directly to your Google Sheet and an email to your Gmail.

### Step 1: Create a Google Sheet
1. Create a new [Google Sheet](https://sheets.new).
2. Name the first five columns in Row 1: `Date`, `Name`, `Email`, `Company`, `Service`, `Message`.
3. Give your sheet a name (e.g., "wlsset design Leads").

### Step 2: Add the Google Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Delete any existing code and paste the following script:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // 1. Append to Sheet
  sheet.appendRow([
    new Date(), 
    data.name, 
    data.email, 
    data.company || 'N/A', 
    data.service, 
    data.message
  ]);
  
  // 2. Send Email Notification
  var myEmail = "YOUR_EMAIL@gmail.com"; // <--- CHANGE THIS TO YOUR EMAIL
  var subject = "New Project Request: " + data.service;
  var body = "You have a new submission:\n\n" +
             "Name: " + data.name + "\n" +
             "Email: " + data.email + "\n" +
             "Company: " + (data.company || 'N/A') + "\n" +
             "Service: " + data.service + "\n" +
             "Message: " + data.message;
             
  MailApp.sendEmail(myEmail, subject, body);
  
  return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Change "YOUR_EMAIL@gmail.com"** to your actual Gmail address.
4. Click the **Save** icon (diskette).

### Step 3: Deploy as a Web App
1. Click the blue **Deploy** button -> **New deployment**.
2. Select type: **Web app**.
3. Description: "wlsset design form handler".
4. Execute as: **Me**.
5. Who has access: **Anyone**. (Crucial for the form to work).
6. Click **Deploy**.
7. You may need to "Authorize Access". Follow the prompts (Click Advanced -> Go to wlsset design (unsafe) if prompted).
8. **Copy the Web App URL** provided at the end.

### Step 4: Connect the Website to the Script
1. Open `client/src/pages/Contact.tsx` in Replit.
2. In the `onSubmit` function (around line 38), replace the simulation code with this:

```typescript
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('YOUR_WEB_APP_URL_HERE', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      
      if (response.ok) {
        toast({
          title: "Request Sent",
          description: "We'll get back to you shortly.",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
```
3. Replace `'YOUR_WEB_APP_URL_HERE'` with the URL you copied in Step 3.

### Step 5: Test directly in Replit Preview
1. Refresh your website in the Replit preview.
2. Go to the Contact page.
3. Fill out the form and click **Send Request**.
4. Check your Google Sheet—the data should appear instantly!
5. Check your Gmail—you should receive a notification!
