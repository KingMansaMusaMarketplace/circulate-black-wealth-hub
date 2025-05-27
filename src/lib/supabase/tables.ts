
import { supabase } from '@/lib/supabase';

export const getTableData = async (tableName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    return [];
  }
};

export const insertTableData = async (tableName: string, data: any) => {
  try {
    const { data: result, error } = await supabase
      .from(tableName as any)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  } catch (error) {
    console.error(`Error inserting data into ${tableName}:`, error);
    return null;
  }
};
