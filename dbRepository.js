const { createClient, FunctionsError } =require("@supabase/supabase-js");
//const prompt = require("prompt-sync")({ sigint: true });
var supabaseUrl = 'https://qxvuqmzydpwwqvldclve.supabase.co'
var supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4dnVxbXp5ZHB3d3F2bGRjbHZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3MjE1NjAwNCwiZXhwIjoxOTg3NzMyMDA0fQ.P5kK_j5vTzKzNcEZOVEkOqIMmAetTFEND7Q7PCTYTnI"
var supabase = createClient(supabaseUrl, supabaseKey);

exports.getBankByPan= async function (pan)
{
  const {data,error} = await supabase
            .from('banks')
            .select()
            .eq('pan_digits',pan);
            console.log(data);
  return data[0];
}

exports.addRequest= async function (request)
{
  const {data,error} = await supabase
            .from('pcc-transactions-requests')
            .insert(request)
            .single();
  return data;
}