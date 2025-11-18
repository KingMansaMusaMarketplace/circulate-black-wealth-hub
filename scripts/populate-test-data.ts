import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agoclnqfyinwjxdmjnns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populateTestData() {
  console.log('Populating test data...');
  
  const { data, error } = await supabase.functions.invoke('populate-test-data', {
    body: {}
  });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Success!', data);
  console.log('\nTest data populated:');
  console.log(`- ${data.data.businesses} businesses`);
  console.log(`- ${data.data.subscriptions} corporate subscriptions`);
  console.log(`- ${data.data.transactions} transactions`);
  console.log(`- ${data.data.reviews} reviews`);
  console.log(`\nTest User ID: ${data.data.testUserId}`);
}

populateTestData();