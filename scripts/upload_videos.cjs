const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://aaygxqyfxkjsukhsgzkm.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || ''; // Set via environment variable

const supabase = createClient(supabaseUrl, supabaseSecretKey);

const videoDir = 'E:\\wasafi';
const bucketName = 'wasafi-videos';

async function uploadVideos() {
    console.log('--- WASAFI VIDEO UPLOAD STARTED ---');
    
    // 1. Create bucket if not exists
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: true
    });
    
    if (bucketError && bucketError.message !== 'Bucket already exists') {
        console.error('Error creating bucket:', bucketError.message);
        return;
    }
    console.log('✅ Bucket verified');

    // 2. Read files from E:\wasafi
    const files = fs.readdirSync(videoDir);
    const videoFiles = files.filter(f => f.endsWith('.mp4'));

    for (const file of videoFiles) {
        const filePath = path.join(videoDir, file);
        const fileBuffer = fs.readFileSync(filePath);

        console.log(`Uploading ${file}...`);
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(file, fileBuffer, {
                contentType: 'video/mp4',
                upsert: true
            });

        if (uploadError) {
            console.error(`❌ Error uploading ${file}:`, uploadError.message);
        } else {
            console.log(`✅ ${file} uploaded successfully!`);
        }
    }

    console.log('--- UPLOAD COMPLETE ---');
}

uploadVideos();
